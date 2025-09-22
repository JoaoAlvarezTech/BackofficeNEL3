// ID generator using browser crypto when available, with safe fallback
function generateId(): string {
  // @ts-ignore
  const c: Crypto | undefined = (typeof window !== 'undefined' ? window.crypto : undefined) || (typeof globalThis !== 'undefined' ? (globalThis as any).crypto : undefined);
  try {
    if (c && typeof (c as any).randomUUID === 'function') {
      return (c as any).randomUUID();
    }
  } catch {}
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Types
export type KycStatus = "pending" | "under_review" | "approved" | "rejected";
export type PartnerStatus = "active" | "inactive";

export interface Partner {
  id: string;
  name: string;
  cnpj: string;
  status: PartnerStatus;
  kycStatus: KycStatus;
  city?: string;
  volumeMonthly?: number;
  contracts?: number;
  affiliatesCount?: number;
  address?: string;
  documents?: Array<{ id: string; name: string; type: string; uploadedAt: string }>;
  createdAt: string;
}

export interface Affiliate {
  id: string;
  name: string;
  cnpj: string; // legacy (não usado para usuários pessoa física)
  cpf?: string;
  crm?: string;
  specialty?: string;
  email?: string;
  phone?: string;
  city: string;
  address?: string;
  status: PartnerStatus;
  kycStatus: KycStatus;
  code?: string; // unique identifier after approval
  associatedPartnerIds: string[]; // can associate to many partners
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description?: string;
  partnerIds: string[]; // available to these partners
  exclusiveAffiliateIds?: string[]; // optional exclusivity
}

export interface RateConfig {
  id: string;
  partnerId: string;
  serviceId: string;
  baseRatePct: number; // percentage applied on value
  fixedFee: number; // flat BRL
  minAmount?: number; // minimum amount for this rate
  maxAmount?: number; // maximum amount for this rate
  effectiveDate: string; // when this rate becomes effective
  expirationDate?: string; // when this rate expires
  isActive: boolean;
  updatedAt: string;
  updatedBy: string;
}

export type ChargeStatus = "pending" | "paid" | "contested" | "canceled";
export interface Charge {
  id: string;
  partnerId: string;
  affiliateId?: string;
  serviceId?: string;
  referenceId?: string; // external reference
  amount: number;
  status: ChargeStatus;
  createdAt: string;
}

export type AdvanceStatus = "requested" | "approved" | "rejected" | "settled";
export interface AdvanceRequest {
  id: string;
  partnerId: string;
  affiliateId?: string;
  amount: number;
  requestedAt: string;
  status: AdvanceStatus;
  appliedRatePct?: number;
}

export type SettlementStatus = "scheduled" | "executed";
export interface Settlement {
  id: string;
  partnerId: string;
  amount: number;
  dueDate: string;
  status: SettlementStatus;
}

export interface ReconciliationItem {
  id: string;
  referenceId: string;
  amountFile: number;
  amountSystem?: number;
  matched: boolean;
  note?: string;
  partnerId?: string;
  transactionDate: string;
  bankCode?: string;
  status: 'pending' | 'matched' | 'discrepancy' | 'resolved';
}

export interface BankIntegration {
  id: string;
  bankCode: string;
  bankName: string;
  integrationType: 'CNAB' | 'API' | 'SFTP';
  status: 'active' | 'inactive' | 'error';
  lastSync: string;
  credentials: {
    endpoint?: string;
    username?: string;
    apiKey?: string;
  };
  config: {
    fileFormat: 'CNAB240' | 'CNAB400' | 'JSON' | 'XML';
    encoding: 'UTF-8' | 'ISO-8859-1';
    delimiter?: string;
  };
}

export interface SettlementInstruction {
  id: string;
  partnerId: string;
  amount: number;
  bankCode: string;
  accountNumber: string;
  agency: string;
  accountType: 'checking' | 'savings';
  status: 'pending' | 'sent' | 'confirmed' | 'failed';
  scheduledDate: string;
  executedDate?: string;
  referenceId: string;
  instructions: string;
}

export interface VolumeReport {
  partnerId: string;
  partnerName: string;
  period: string;
  totalVolume: number;
  pendingCharges: number;
  paidCharges: number;
  contestedCharges: number;
  averageTicket: number;
  transactionCount: number;
  lastUpdated: string;
}

export interface Notification {
  id: string;
  type: 'kyc' | 'advance' | 'settlement' | 'security' | 'agenda';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  read: boolean;
  createdAt: string;
  partnerId?: string;
  affiliateId?: string;
  actionUrl?: string;
}

export interface Contract {
  id: string;
  partnerId: string;
  affiliateId?: string;
  type: 'service' | 'exclusivity' | 'penalty';
  status: 'draft' | 'active' | 'suspended' | 'terminated';
  terms: string;
  penaltyRate?: number;
  exclusivityPeriod?: number; // months
  createdAt: string;
  effectiveDate: string;
  expirationDate?: string;
}

export interface RiskScore {
  id: string;
  partnerId: string;
  score: number; // 0-1000
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  lastUpdated: string;
}

export interface Limit {
  id: string;
  partnerId: string;
  type: 'daily' | 'monthly' | 'transaction';
  amount: number;
  used: number;
  period: string; // yyyy-mm-dd for daily, yyyy-mm for monthly
  createdAt: string;
}

// Invoices (Notas Fiscais)
export type InvoiceStatus = "pending" | "approved" | "rejected";
export interface Invoice {
  id: string;
  number: string; // NF number
  partnerId: string;
  affiliateId?: string;
  amount: number;
  issueDate: string; // yyyy-mm-dd
  dueDate?: string; // yyyy-mm-dd
  status: InvoiceStatus;
  description?: string;
  createdAt: string;
}

export interface AgendaSlot {
  id: string;
  partnerId: string;
  date: string; // yyyy-mm-dd
  capacity: number; // total capacity for that day
  booked: number; // used capacity
}

// Storage
const STORAGE_KEY = "hpm_mockdb_v1";

interface DbSchema {
  partners: Partner[];
  affiliates: Affiliate[];
  services: ServiceItem[];
  rates: RateConfig[];
  charges: Charge[];
  advances: AdvanceRequest[];
  settlements: Settlement[];
  reconciliation: ReconciliationItem[];
  bankIntegrations: BankIntegration[];
  settlementInstructions: SettlementInstruction[];
  volumeReports: VolumeReport[];
  agendas: AgendaSlot[];
  notifications: Notification[];
  contracts: Contract[];
  riskScores: RiskScore[];
  limits: Limit[];
  invoices: Invoice[];
}

function getDb(): DbSchema {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = seedDb();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<DbSchema>;
    // Backward-compatible shape fixes
    if (!Array.isArray(parsed.partners)) parsed.partners = [];
    if (!Array.isArray(parsed.affiliates)) parsed.affiliates = [];
    if (!Array.isArray(parsed.services)) parsed.services = [];
    if (!Array.isArray(parsed.rates)) parsed.rates = [];
    if (!Array.isArray(parsed.charges)) parsed.charges = [];
    if (!Array.isArray(parsed.advances)) parsed.advances = [];
    if (!Array.isArray(parsed.settlements)) parsed.settlements = [];
    if (!Array.isArray(parsed.reconciliation)) parsed.reconciliation = [];
    if (!Array.isArray(parsed.bankIntegrations)) parsed.bankIntegrations = [];
    if (!Array.isArray(parsed.settlementInstructions)) parsed.settlementInstructions = [];
    if (!Array.isArray(parsed.volumeReports)) parsed.volumeReports = [];
    if (!Array.isArray(parsed.agendas)) parsed.agendas = [];
    if (!Array.isArray(parsed.notifications)) parsed.notifications = [];
    if (!Array.isArray(parsed.contracts)) parsed.contracts = [];
    if (!Array.isArray(parsed.riskScores)) parsed.riskScores = [];
    if (!Array.isArray(parsed.limits)) parsed.limits = [];
    if (!Array.isArray((parsed as any).invoices)) (parsed as any).invoices = [];
    const fixed = parsed as DbSchema;

    // Augment with generated data if insufficient for demo (focados em usuários)
    try {
      const partnersAll = fixed.partners;
      let affiliatesAll = fixed.affiliates;
      const today = new Date();
      
      // Ensure we have enough affiliates with person names
      if (affiliatesAll.length < 20) {
        const personNames = [
          "Dr. Pedro Almeida", "Dra. Luiza Martins", "Dr. Rafael Souza", "Dra. Ana Beatriz",
          "Dr. Gustavo Lima", "Dra. Fernanda Rocha", "Dr. Henrique Campos", "Dra. Paula Nogueira",
          "Dr. Thiago Ribeiro", "Dra. Camila Duarte", "Dr. Felipe Azevedo", "Dra. Renata Pires",
          "Dr. Marcelo Costa", "Dra. Juliana Silva", "Dr. Roberto Santos", "Dra. Patricia Lima",
          "Dr. André Oliveira", "Dra. Beatriz Ferreira", "Dr. Lucas Rodrigues", "Dra. Vanessa Alves",
          "Dr. Bruno Mendes", "Dra. Carla Santos", "Dr. Diego Oliveira", "Dra. Eliana Costa",
          "Dr. Fabio Rocha", "Dra. Gabriela Lima", "Dr. Hugo Pereira", "Dra. Isabela Alves",
          "Dr. João Silva", "Dra. Maria Oliveira", "Dr. Carlos Santos", "Dra. Ana Costa",
          "Dr. Paulo Lima", "Dra. Juliana Rocha", "Dr. Ricardo Alves", "Dra. Patricia Mendes"
        ];
        const specialties = [
          "Cardiologia", "Pediatria", "Ortopedia", "Dermatologia", "Ginecologia", "Neurologia",
          "Oftalmologia", "Endocrinologia", "Oncologia", "Psiquiatria", "Urologia", "Gastroenterologia"
        ];
        
        const need = 25 - affiliatesAll.length;
        for (let i = 0; i < need; i++) {
          const partner = partnersAll[Math.floor(Math.random() * partnersAll.length)];
          const name = personNames[i % personNames.length];
          const specialty = specialties[i % specialties.length];
          const cpf = `${Math.floor(100 + Math.random() * 900)}.${Math.floor(100 + Math.random() * 900)}.${Math.floor(100 + Math.random() * 900)}-${Math.floor(10 + Math.random() * 90)}`;
          const crm = `${Math.floor(10000 + Math.random() * 90000)}/${['SP', 'RJ', 'MG', 'RS', 'PR'][Math.floor(Math.random() * 5)]}`;
          
          affiliatesAll.push({
            id: generateId(),
            name: name,
            cnpj: `${Math.floor(10 + Math.random() * 90)}.${Math.floor(100 + Math.random() * 900)}.${Math.floor(100 + Math.random() * 900)}/0001-${Math.floor(10 + Math.random() * 90)}`,
            cpf: cpf,
            crm: crm,
            specialty: specialty,
            email: `${name.toLowerCase().replace(/[^a-z]/g, '')}@example.com`,
            phone: `+55 (${Math.floor(10 + Math.random() * 90)}) ${Math.floor(9000 + Math.random() * 1000)}-${Math.floor(1000 + Math.random() * 9000)}`,
            city: partner.city,
            address: `Rua ${name.split(' ')[1]}, ${Math.floor(100 + Math.random() * 900)}`,
            status: Math.random() < 0.8 ? "active" : "inactive",
            kycStatus: Math.random() < 0.9 ? "approved" : "pending",
            code: `AFF-${String(1000 + i).padStart(4, '0')}`,
            associatedPartnerIds: [partner.id],
            createdAt: new Date().toISOString()
          });
        }
        fixed.affiliates = affiliatesAll;
      }

      // Ensure invoices volume - gerar para usuários (affiliate-centric)
      if ((fixed.invoices?.length || 0) < 100 && partnersAll.length > 0 && affiliatesAll.length > 0) {
        const need = 150 - (fixed.invoices?.length || 0);
        for (let i = 0; i < need; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() - Math.floor(Math.random() * 90));
          const aff = affiliatesAll[Math.floor(Math.random() * affiliatesAll.length)];
          const partnerIdFromAffiliate = aff.associatedPartnerIds && aff.associatedPartnerIds.length > 0 ? aff.associatedPartnerIds[0] : (partnersAll[0]?.id || generateId());
          const amount = Math.floor(500 + Math.random() * 15000);
          const statusPool: InvoiceStatus[] = ["pending", "approved", "rejected"];
          const status = statusPool[Math.floor(Math.random() * statusPool.length)];
          fixed.invoices.push({
            id: generateId(),
            number: `NF-${String(10000 + Math.floor(Math.random()*90000))}`,
            partnerId: partnerIdFromAffiliate,
            affiliateId: aff.id,
            amount,
            issueDate: d.toISOString().slice(0,10),
            dueDate: new Date(d.getTime() + 15*86400000).toISOString().slice(0,10),
            status,
            description: "Serviços médicos realizados",
            createdAt: new Date().toISOString(),
          });
        }
      }

      // Ensure advances volume
      if ((fixed.advances?.length || 0) < 100 && partnersAll.length > 0) {
        const need = 200 - (fixed.advances?.length || 0);
        for (let i = 0; i < need; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() - Math.floor(Math.random() * 90));
          const partner = partnersAll[Math.floor(Math.random() * partnersAll.length)];
          const aff = affiliatesAll.length > 0 ? affiliatesAll[Math.floor(Math.random() * affiliatesAll.length)] : undefined;
          const amount = Math.floor(2000 + Math.random() * 150000);
          const statusPool: AdvanceStatus[] = ["requested", "approved", "settled", "rejected"];
          const status = statusPool[Math.floor(Math.random() * statusPool.length)];
          fixed.advances.push({
            id: generateId(),
            partnerId: partner.id,
            affiliateId: aff?.id,
            amount,
            requestedAt: d.toISOString(),
            status,
            appliedRatePct: status === "approved" || status === "settled" ? 2 + Math.round(Math.random() * 200) / 10 : undefined
          });
        }
      }

      // Ensure charges volume
      if ((fixed.charges?.length || 0) < 200 && partnersAll.length > 0) {
        const need = 400 - (fixed.charges?.length || 0);
        const chargeStatuses: ChargeStatus[] = ["pending", "paid", "contested", "canceled"];
        for (let i = 0; i < need; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() - Math.floor(Math.random() * 90));
          const partner = partnersAll[Math.floor(Math.random() * partnersAll.length)];
          const aff = affiliatesAll.length > 0 ? affiliatesAll[Math.floor(Math.random() * affiliatesAll.length)] : undefined;
          const amount = Math.floor(150 + Math.random() * 15000);
          const status = chargeStatuses[Math.floor(Math.random() * chargeStatuses.length)];
          fixed.charges.push({
            id: generateId(),
            partnerId: partner.id,
            affiliateId: aff?.id,
            serviceId: undefined,
            referenceId: `CHG-${String(100000 + Math.floor(Math.random()*900000))}`,
            amount,
            status,
            createdAt: d.toISOString(),
          });
        }
      }
    } catch {}

    // Persist fixes/augmentation
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fixed));
    
    // Ensure all invoices have affiliateId linked - ALWAYS execute this check
    if (fixed.invoices && fixed.invoices.length > 0) {
      if (fixed.affiliates && fixed.affiliates.length > 0) {
        let fixedCount = 0;
        fixed.invoices.forEach(invoice => {
          if (!invoice.affiliateId) {
            const randomAffiliate = fixed.affiliates[Math.floor(Math.random() * fixed.affiliates.length)];
            invoice.affiliateId = randomAffiliate.id;
            
            if (randomAffiliate.associatedPartnerIds && randomAffiliate.associatedPartnerIds.length > 0) {
              invoice.partnerId = randomAffiliate.associatedPartnerIds[0];
            }
            
            fixedCount++;
          }
        });
        
        if (fixedCount > 0) {
          console.log(`Auto-fixed ${fixedCount} invoices by linking them to affiliates`);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(fixed));
        }
      } else {
        console.warn('No affiliates available to link invoices - this should not happen');
      }
    }
    
    return fixed;
  } catch {
    const seeded = seedDb();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

function setDb(db: DbSchema): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

// Seed data
function seedDb(): DbSchema {
  const p1: Partner = {
    id: generateId(),
    name: "Hospital São Lucas",
    cnpj: "12.345.678/0001-90",
    status: "active",
    kycStatus: "approved",
    city: "São Paulo",
    volumeMonthly: 850000,
    contracts: 3,
    affiliatesCount: 12,
    createdAt: new Date().toISOString()
  };
  const p2: Partner = {
    id: generateId(),
    name: "Clínica Nova Era",
    cnpj: "98.765.432/0001-10",
    status: "active",
    kycStatus: "approved",
    city: "Rio de Janeiro",
    volumeMonthly: 650000,
    contracts: 2,
    affiliatesCount: 8,
    createdAt: new Date().toISOString()
  };
  const p3: Partner = {
    id: generateId(),
    name: "Med Center Plus",
    cnpj: "11.222.333/0001-44",
    status: "inactive",
    kycStatus: "pending",
    city: "Belo Horizonte",
    volumeMonthly: 0,
    contracts: 0,
    affiliatesCount: 0,
    createdAt: new Date().toISOString()
  };

  const a1: Affiliate = {
    id: generateId(),
    name: "Dr. João Cardoso",
    cnpj: "22.333.444/0001-55",
    cpf: "123.456.789-10",
    crm: "12345/SP",
    specialty: "Cardiologia",
    email: "joao.cardio@example.com",
    phone: "+55 (11) 99999-1111",
    city: "São Paulo",
    address: "Rua das Flores, 123",
    status: "active",
    kycStatus: "approved",
    code: "AFF-0001",
    associatedPartnerIds: [p1.id],
    createdAt: new Date().toISOString()
  };

  const a2: Affiliate = {
    id: generateId(),
    name: "Dra. Maria Pedrosa",
    cnpj: "33.444.555/0001-66",
    cpf: "987.654.321-00",
    crm: "67890/RJ",
    specialty: "Pediatria",
    email: "maria.ped@example.com",
    phone: "+55 (21) 98888-2222",
    city: "Rio de Janeiro",
    address: "Av. Copacabana, 456",
    status: "active",
    kycStatus: "approved",
    code: "AFF-0002",
    associatedPartnerIds: [p2.id],
    createdAt: new Date().toISOString()
  };

  const a3: Affiliate = {
    id: generateId(),
    name: "Dr. Carlos Andrade",
    cnpj: "44.555.666/0001-77",
    cpf: "321.654.987-00",
    crm: "11223/MG",
    specialty: "Ortopedia",
    email: "carlos.orto@example.com",
    phone: "+55 (31) 97777-3333",
    city: "Belo Horizonte",
    address: "Rua da Liberdade, 789",
    status: "inactive",
    kycStatus: "pending",
    code: "AFF-0003",
    associatedPartnerIds: [p3.id],
    createdAt: new Date().toISOString()
  };

  const s1: ServiceItem = { id: generateId(), name: "Consulta Clínica", partnerIds: [p1.id, p2.id] };
  const s2: ServiceItem = { id: generateId(), name: "Exame Laboratorial", partnerIds: [p1.id] };

  const r1: RateConfig = {
    id: generateId(),
    partnerId: p1.id,
    serviceId: s1.id,
    baseRatePct: 2.5,
    fixedFee: 3.5,
    effectiveDate: new Date().toISOString(),
    isActive: true,
    updatedAt: new Date().toISOString(),
    updatedBy: "admin"
  };

  const charge1: Charge = {
    id: generateId(), partnerId: p1.id, amount: 1200, status: "pending", createdAt: new Date().toISOString(), referenceId: "CHG-001", serviceId: s1.id
  };

  const adv1: AdvanceRequest = {
    id: generateId(), partnerId: p1.id, amount: 50000, requestedAt: new Date().toISOString(), status: "requested"
  };

  const set1: Settlement = {
    id: generateId(), partnerId: p1.id, amount: 20000, dueDate: new Date(Date.now() + 3 * 86400000).toISOString(), status: "scheduled"
  };

  const agenda1: AgendaSlot = {
    id: generateId(), partnerId: p1.id, date: new Date().toISOString().slice(0, 10), capacity: 20, booked: 12
  };

  const notif1: Notification = {
    id: generateId(),
    type: 'kyc',
    title: 'KYC Pendente',
    message: 'Hospital São Lucas precisa aprovar documentos',
    priority: 'high',
    read: false,
    createdAt: new Date().toISOString(),
    partnerId: p1.id,
    actionUrl: '/partners/kyc'
  };

  const notif2: Notification = {
    id: generateId(),
    type: 'advance',
    title: 'Antecipação Excepcional',
    message: 'Pedido de R$ 500k precisa aprovação manual',
    priority: 'critical',
    read: false,
    createdAt: new Date().toISOString(),
    partnerId: p1.id,
    actionUrl: '/advances/approvals'
  };

  const contract1: Contract = {
    id: generateId(),
    partnerId: p1.id,
    type: 'service',
    status: 'active',
    terms: 'Contrato de prestação de serviços médicos',
    penaltyRate: 0.5,
    createdAt: new Date().toISOString(),
    effectiveDate: new Date().toISOString(),
    expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
  };

  const risk1: RiskScore = {
    id: generateId(),
    partnerId: p1.id,
    score: 750,
    level: 'low',
    factors: ['Volume consistente', 'Pagamentos em dia', 'Documentação completa'],
    lastUpdated: new Date().toISOString()
  };

  const limit1: Limit = {
    id: generateId(),
    partnerId: p1.id,
    type: 'daily',
    amount: 100000,
    used: 25000,
    period: new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString()
  };

  // Bank Integrations
  const bank1: BankIntegration = {
    id: generateId(),
    bankCode: "001",
    bankName: "Banco do Brasil",
    integrationType: "CNAB",
    status: "active",
    lastSync: new Date().toISOString(),
    credentials: {
      endpoint: "https://api.bb.com.br",
      username: "nel3_bb",
      apiKey: "bb_api_key_123"
    },
    config: {
      fileFormat: "CNAB240",
      encoding: "UTF-8",
      delimiter: ";"
    }
  };

  const bank2: BankIntegration = {
    id: generateId(),
    bankCode: "341",
    bankName: "Itaú Unibanco",
    integrationType: "API",
    status: "active",
    lastSync: new Date().toISOString(),
    credentials: {
      endpoint: "https://api.itau.com.br",
      username: "nel3_itau",
      apiKey: "itau_api_key_456"
    },
    config: {
      fileFormat: "JSON",
      encoding: "UTF-8"
    }
  };

  // Settlement Instructions
  const settlement1: SettlementInstruction = {
    id: generateId(),
    partnerId: p1.id,
    amount: 50000,
    bankCode: "001",
    accountNumber: "12345-6",
    agency: "1234",
    accountType: "checking",
    status: "pending",
    scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    referenceId: "SET-001",
    instructions: "Liquidação automática via CNAB"
  };

  // Volume Reports
  const volume1: VolumeReport = {
    partnerId: p1.id,
    partnerName: p1.name,
    period: "2024-01",
    totalVolume: 850000,
    pendingCharges: 150000,
    paidCharges: 650000,
    contestedCharges: 50000,
    averageTicket: 1200,
    transactionCount: 708,
    lastUpdated: new Date().toISOString()
  };

  // Enhanced Rate Configs
  const r1Enhanced: RateConfig = {
    id: r1.id,
    partnerId: p1.id,
    serviceId: s1.id,
    baseRatePct: 2.5,
    fixedFee: 3.5,
    minAmount: 100,
    maxAmount: 10000,
    effectiveDate: new Date().toISOString(),
    isActive: true,
    updatedAt: new Date().toISOString(),
    updatedBy: "admin"
  };

  const r2: RateConfig = {
    id: generateId(),
    partnerId: p2.id,
    serviceId: s1.id,
    baseRatePct: 2.8,
    fixedFee: 4.0,
    minAmount: 200,
    maxAmount: 15000,
    effectiveDate: new Date().toISOString(),
    isActive: true,
    updatedAt: new Date().toISOString(),
    updatedBy: "admin"
  };

  // Generate invoices (mock) across last 90 days (focados em usuários)
  const invoices: Invoice[] = [];
  const partnersAll = [p1, p2, p3];
  
  // Generate more affiliates with person names
  const personNames = [
    "Dr. Pedro Almeida", "Dra. Luiza Martins", "Dr. Rafael Souza", "Dra. Ana Beatriz",
    "Dr. Gustavo Lima", "Dra. Fernanda Rocha", "Dr. Henrique Campos", "Dra. Paula Nogueira",
    "Dr. Thiago Ribeiro", "Dra. Camila Duarte", "Dr. Felipe Azevedo", "Dra. Renata Pires",
    "Dr. Marcelo Costa", "Dra. Juliana Silva", "Dr. Roberto Santos", "Dra. Patricia Lima",
    "Dr. André Oliveira", "Dra. Beatriz Ferreira", "Dr. Lucas Rodrigues", "Dra. Vanessa Alves",
    "Dr. Bruno Mendes", "Dra. Carla Santos", "Dr. Diego Oliveira", "Dra. Eliana Costa",
    "Dr. Fabio Rocha", "Dra. Gabriela Lima", "Dr. Hugo Pereira", "Dra. Isabela Alves",
    "Dr. João Silva", "Dra. Maria Oliveira", "Dr. Carlos Santos", "Dra. Ana Costa",
    "Dr. Paulo Lima", "Dra. Juliana Rocha", "Dr. Ricardo Alves", "Dra. Patricia Mendes"
  ];
  const specialties = [
    "Cardiologia", "Pediatria", "Ortopedia", "Dermatologia", "Ginecologia", "Neurologia",
    "Oftalmologia", "Endocrinologia", "Oncologia", "Psiquiatria", "Urologia", "Gastroenterologia"
  ];
  
  const affiliatesAll = [a1, a2, a3];
  // Add more affiliates with person names
  for (let i = 0; i < 25; i++) {
    const partner = partnersAll[Math.floor(Math.random() * partnersAll.length)];
    const name = personNames[i % personNames.length];
    const specialty = specialties[i % specialties.length];
    const cpf = `${Math.floor(100 + Math.random() * 900)}.${Math.floor(100 + Math.random() * 900)}.${Math.floor(100 + Math.random() * 900)}-${Math.floor(10 + Math.random() * 90)}`;
    const crm = `${Math.floor(10000 + Math.random() * 90000)}/${['SP', 'RJ', 'MG', 'RS', 'PR'][Math.floor(Math.random() * 5)]}`;
    
    affiliatesAll.push({
      id: generateId(),
      name: name,
      cnpj: `${Math.floor(10 + Math.random() * 90)}.${Math.floor(100 + Math.random() * 900)}.${Math.floor(100 + Math.random() * 900)}/0001-${Math.floor(10 + Math.random() * 90)}`,
      cpf: cpf,
      crm: crm,
      specialty: specialty,
      email: `${name.toLowerCase().replace(/[^a-z]/g, '')}@example.com`,
      phone: `+55 (${Math.floor(10 + Math.random() * 90)}) ${Math.floor(9000 + Math.random() * 1000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      city: partner.city,
      address: `Rua ${name.split(' ')[1]}, ${Math.floor(100 + Math.random() * 900)}`,
      status: Math.random() < 0.8 ? "active" : "inactive",
      kycStatus: Math.random() < 0.9 ? "approved" : "pending",
      code: `AFF-${String(1000 + i).padStart(4, '0')}`,
      associatedPartnerIds: [partner.id],
      createdAt: new Date().toISOString()
    });
  }
  
  const today = new Date();
  const totalInvoices = 200; // Increased volume
  for (let i = 0; i < totalInvoices; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - Math.floor(Math.random() * 90));
    const aff = affiliatesAll[Math.floor(Math.random() * affiliatesAll.length)];
    const partnerIdFromAffiliate = aff.associatedPartnerIds && aff.associatedPartnerIds.length > 0 ? aff.associatedPartnerIds[0] : (partnersAll[0]?.id || generateId());
    const amount = Math.floor(500 + Math.random() * 15000); // 500 ~ 15000
    const statusPool: InvoiceStatus[] = ["pending", "approved", "rejected"];
    const status = statusPool[Math.floor(Math.random() * statusPool.length)];
    invoices.push({
      id: generateId(),
      number: `NF-${String(10000 + Math.floor(Math.random()*90000))}`,
      partnerId: partnerIdFromAffiliate,
      affiliateId: aff.id,
      amount,
      issueDate: d.toISOString().slice(0,10),
      dueDate: new Date(d.getTime() + 15*86400000).toISOString().slice(0,10),
      status,
      description: "Serviços médicos realizados",
      createdAt: new Date().toISOString(),
    });
  }

  // Helper lists for person names and specialties (moved to avoid redeclaration)
  const personNamesList = [
    "Dr. Pedro Almeida", "Dra. Luiza Martins", "Dr. Rafael Souza", "Dra. Ana Beatriz",
    "Dr. Gustavo Lima", "Dra. Fernanda Rocha", "Dr. Henrique Campos", "Dra. Paula Nogueira",
    "Dr. Thiago Ribeiro", "Dra. Camila Duarte", "Dr. Felipe Azevedo", "Dra. Renata Pires"
  ];
  const specialtiesList = [
    "Cardiologia", "Pediatria", "Ortopedia", "Dermatologia", "Ginecologia", "Neurologia",
    "Oftalmologia", "Endocrinologia", "Oncologia", "Psiquiatria"
  ];

  // Generate advances (mock) across last 90 days
  const generatedAdvances: AdvanceRequest[] = [];
  const totalAdvancesGen = 200;
  for (let i = 0; i < totalAdvancesGen; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - Math.floor(Math.random() * 90));
    const aff = affiliatesAll[Math.floor(Math.random() * affiliatesAll.length)];
    const partner = aff.associatedPartnerIds && aff.associatedPartnerIds.length > 0 ? { id: aff.associatedPartnerIds[0] } as any : partnersAll[Math.floor(Math.random() * partnersAll.length)];
    const amount = Math.floor(2000 + Math.random() * 150000); // 2k ~ 150k
    const statusPool: AdvanceStatus[] = ["requested", "approved", "settled", "rejected"];
    const status = statusPool[Math.floor(Math.random() * statusPool.length)];
    generatedAdvances.push({
      id: generateId(),
      partnerId: partner.id,
      affiliateId: aff.id,
      amount,
      requestedAt: d.toISOString(),
      status,
      appliedRatePct: status === "approved" || status === "settled" ? 2 + Math.round(Math.random() * 200) / 10 : undefined
    });
  }

  // Generate charges/receivables (mock) across last 90 days
  const generatedCharges: Charge[] = [];
  const totalChargesGen = 400;
  const chargeStatuses: ChargeStatus[] = ["pending", "paid", "contested", "canceled"];
  for (let i = 0; i < totalChargesGen; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - Math.floor(Math.random() * 90));
    const aff = affiliatesAll[Math.floor(Math.random() * affiliatesAll.length)];
    const partnerId = aff.associatedPartnerIds && aff.associatedPartnerIds.length > 0 ? aff.associatedPartnerIds[0] : partnersAll[Math.floor(Math.random() * partnersAll.length)].id;
    const serviceId = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, s1.id, s2.id][Math.floor(Math.random()*10)];
    const amount = Math.floor(150 + Math.random() * 15000);
    const status = chargeStatuses[Math.floor(Math.random() * chargeStatuses.length)];
    generatedCharges.push({
      id: generateId(),
      partnerId,
      affiliateId: aff.id,
      serviceId,
      referenceId: `CHG-${String(100000 + i)}`,
      amount,
      status,
      createdAt: d.toISOString(),
    });
  }

  return {
    partners: [p1, p2, p3],
    affiliates: [a1, a2, a3],
    services: [s1, s2],
    rates: [r1Enhanced, r2],
    charges: [charge1, ...generatedCharges],
    advances: [adv1, ...generatedAdvances],
    settlements: [set1],
    reconciliation: [],
    bankIntegrations: [bank1, bank2],
    settlementInstructions: [settlement1],
    volumeReports: [volume1],
    agendas: [agenda1],
    notifications: [notif1, notif2],
    contracts: [contract1],
    riskScores: [risk1],
    limits: [limit1],
    invoices
  };
}

// Public API (CRUD-ish)
export const mockdb = {
  // Utility functions
  getDb,
  setDb,
  // Partners
  listPartners(): Partner[] { return getDb().partners; },
  getPartner(id: string): Partner | undefined { return getDb().partners.find(p => p.id === id); },
  upsertPartner(input: Omit<Partner, "id" | "createdAt"> & { id?: string }): Partner {
    const db = getDb();
    const now = new Date().toISOString();
    if (input.id) {
      const idx = db.partners.findIndex(p => p.id === input.id);
      if (idx >= 0) {
        db.partners[idx] = { ...db.partners[idx], ...input } as Partner;
      }
    } else {
      const created: Partner = { id: generateId(), createdAt: now, documents: [], contracts: 0, affiliatesCount: 0, volumeMonthly: 0, ...input };
      db.partners.unshift(created);
      setDb(db);
      return created;
    }
    setDb(db);
    return db.partners.find(p => p.id === input.id)!;
  },
  setPartnerKyc(id: string, kyc: KycStatus): void {
    console.log('setPartnerKyc called with:', id, kyc);
    const db = getDb();
    console.log('Current partners in DB:', db.partners.map(p => ({ id: p.id, name: p.name, kycStatus: p.kycStatus })));
    
    const p = db.partners.find(x => x.id === id);
    if (p) { 
      console.log('Updating partner KYC:', id, 'from', p.kycStatus, 'to', kyc);
      p.kycStatus = kyc; 
      setDb(db);
      console.log('Partner KYC updated successfully');
      
      // Verify the update
      const updatedDb = getDb();
      const updatedPartner = updatedDb.partners.find(x => x.id === id);
      console.log('Verification - partner after update:', updatedPartner);
    } else {
      console.error('Partner not found for KYC update:', id);
      console.error('Available partner IDs:', db.partners.map(p => p.id));
    }
  },
  deletePartner(id: string): boolean {
    const db = getDb();
    const index = db.partners.findIndex(x => x.id === id);
    if (index >= 0) {
      db.partners.splice(index, 1);
      setDb(db);
      return true;
    }
    return false;
  },
  addPartnerDocument(partnerId: string, file: { name: string; type: string }): void {
    const db = getDb();
    const p = db.partners.find(x => x.id === partnerId);
    if (!p) return;
    if (!p.documents) p.documents = [];
    p.documents.push({ id: generateId(), name: file.name, type: file.type, uploadedAt: new Date().toISOString() });
    setDb(db);
  },

  // Affiliates
  listAffiliates(): Affiliate[] { return getDb().affiliates; },
  createAffiliate(input: Omit<Affiliate, "id" | "createdAt" | "status" | "kycStatus" | "code"> & { status?: PartnerStatus; kycStatus?: KycStatus }): Affiliate {
    const db = getDb();
    const item: Affiliate = {
      id: generateId(),
      name: input.name,
      cnpj: input.cnpj,
      cpf: input.cpf,
      crm: input.crm,
      specialty: input.specialty,
      email: input.email,
      phone: input.phone,
      city: input.city,
      address: input.address,
      associatedPartnerIds: input.associatedPartnerIds ?? [],
      status: input.status ?? "active",
      kycStatus: input.kycStatus ?? "pending",
      createdAt: new Date().toISOString()
    };
    db.affiliates.unshift(item);
    setDb(db);
    return item;
  },
  upsertAffiliate(input: Omit<Affiliate, "id" | "createdAt"> & { id?: string }): Affiliate {
    const db = getDb();
    const now = new Date().toISOString();
    if (input.id) {
      const idx = db.affiliates.findIndex(a => a.id === input.id);
      if (idx >= 0) {
        db.affiliates[idx] = { ...db.affiliates[idx], ...input } as Affiliate;
        setDb(db);
        return db.affiliates[idx];
      }
    }
    const created: Affiliate = { ...input, id: generateId(), createdAt: now } as Affiliate;
    db.affiliates.unshift(created);
    setDb(db);
    return created;
  },
  approveAffiliate(id: string): void {
    const db = getDb();
    const a = db.affiliates.find(x => x.id === id);
    if (a) { a.kycStatus = "approved"; a.code = a.code ?? ("AFF-" + Math.random().toString(36).slice(2, 6).toUpperCase()); setDb(db); }
  },
  rejectAffiliate(id: string): void {
    const db = getDb();
    const a = db.affiliates.find(x => x.id === id);
    if (a) { a.kycStatus = "rejected"; setDb(db); }
  },
  deleteAffiliate(id: string): boolean {
    const db = getDb();
    const index = db.affiliates.findIndex(x => x.id === id);
    if (index >= 0) {
      db.affiliates.splice(index, 1);
      setDb(db);
      return true;
    }
    return false;
  },
  associateAffiliateToPartners(id: string, partnerIds: string[]): void {
    const db = getDb();
    const a = db.affiliates.find(x => x.id === id);
    if (a) { a.associatedPartnerIds = partnerIds; setDb(db); }
  },

  // Services & Rates
  listServices(): ServiceItem[] { return getDb().services; },
  upsertRate(config: Omit<RateConfig, "id" | "updatedAt"> & { id?: string }): RateConfig {
    const db = getDb();
    if (config.id) {
      const idx = db.rates.findIndex(r => r.id === config.id);
      if (idx >= 0) {
        db.rates[idx] = { ...db.rates[idx], ...config, updatedAt: new Date().toISOString() } as RateConfig;
        setDb(db);
        return db.rates[idx];
      }
    }
    const created: RateConfig = { ...config, id: generateId(), updatedAt: new Date().toISOString() } as RateConfig;
    db.rates.unshift(created);
    setDb(db);
    return created;
  },
  listRates(): RateConfig[] { return getDb().rates; },

  // Charges & Operations
  listCharges(): Charge[] { return getDb().charges; },
  upsertCharge(item: Omit<Charge, "id" | "createdAt"> & { id?: string }): Charge {
    const db = getDb();
    
    if (item.id) {
      const idx = db.charges.findIndex(c => c.id === item.id);
      if (idx >= 0) {
        db.charges[idx] = { ...db.charges[idx], ...item } as Charge;
        setDb(db);
        return db.charges[idx];
      }
    }
    const created: Charge = { ...item, id: generateId(), createdAt: new Date().toISOString() } as Charge;
    db.charges.unshift(created);
    setDb(db);
    return created;
  },

  // Advances
  listAdvances(): AdvanceRequest[] { return getDb().advances; },
  createAdvance(input: { partnerId: string; amount: number; affiliateId?: string }): AdvanceRequest {
    const db = getDb();
    const created: AdvanceRequest = {
      id: generateId(),
      partnerId: input.partnerId,
      affiliateId: input.affiliateId,
      amount: input.amount,
      requestedAt: new Date().toISOString(),
      status: "requested",
      appliedRatePct: undefined
    };
    db.advances.unshift(created);
    setDb(db);
    return created;
  },
  setAdvanceStatus(id: string, status: AdvanceStatus, ratePct?: number): void {
    const db = getDb();
    const a = db.advances.find(x => x.id === id);
    if (a) { a.status = status; if (ratePct != null) a.appliedRatePct = ratePct; setDb(db); }
  },

  // Settlements
  listSettlements(): Settlement[] { return getDb().settlements; },
  setSettlementStatus(id: string, status: SettlementStatus): void {
    const db = getDb();
    const s = db.settlements.find(x => x.id === id);
    if (s) { s.status = status; setDb(db); }
  },

  // Reconciliation
  listReconciliation(): ReconciliationItem[] { return getDb().reconciliation; },
  addReconciliationItems(items: ReconciliationItem[]): void {
    const db = getDb();
    db.reconciliation.unshift(...items);
    setDb(db);
  },
  autoMatchReconciliation(): void {
    const db = getDb();
    db.reconciliation = db.reconciliation.map(item => {
      if (item.matched) return item;
      const charge = db.charges.find(c => c.referenceId && c.referenceId === item.referenceId);
      if (charge) {
        const amountSystem = charge.amount;
        const matched = Math.abs(amountSystem - item.amountFile) < 0.01;
        return { ...item, amountSystem, matched } as ReconciliationItem;
      }
      return item;
    });
    setDb(db);
  },

  // Agenda
  listAgenda(partnerId?: string): AgendaSlot[] {
    const db = getDb();
    return db.agendas.filter(a => !partnerId || a.partnerId === partnerId);
  },
  upsertAgenda(slot: Omit<AgendaSlot, "id"> & { id?: string }): AgendaSlot {
    const db = getDb();
    if (slot.id) {
      const idx = db.agendas.findIndex(a => a.id === slot.id);
      if (idx >= 0) { db.agendas[idx] = { ...db.agendas[idx], ...slot } as AgendaSlot; setDb(db); return db.agendas[idx]; }
    }
    const created: AgendaSlot = { ...slot, id: generateId() } as AgendaSlot;
    db.agendas.unshift(created);
    setDb(db);
    return created;
  },

  // Notifications
  listNotifications(): Notification[] { return getDb().notifications; },
  createNotification(notif: Omit<Notification, "id" | "createdAt" | "read">): Notification {
    try {
      const db = getDb();
      const created: Notification = { 
        ...notif, 
        id: generateId(), 
        createdAt: new Date().toISOString(), 
        read: false 
      };
      db.notifications.unshift(created);
      setDb(db);
      return created;
    } catch (error) {
      console.error('Error creating notification:', error);
      // Return a minimal notification object to prevent crashes
      return {
        id: generateId(),
        type: notif.type,
        title: notif.title,
        message: notif.message,
        priority: notif.priority,
        read: false,
        createdAt: new Date().toISOString(),
        partnerId: notif.partnerId,
        affiliateId: notif.affiliateId,
        actionUrl: notif.actionUrl
      };
    }
  },
  markNotificationRead(id: string): void {
    const db = getDb();
    const n = db.notifications.find(x => x.id === id);
    if (n) { n.read = true; setDb(db); }
  },
  markAllNotificationsRead(): void {
    const db = getDb();
    db.notifications.forEach(n => n.read = true);
    setDb(db);
  },

  // Contracts
  listContracts(): Contract[] { return getDb().contracts; },
  createContract(contract: Omit<Contract, "id" | "createdAt">): Contract {
    const db = getDb();
    const created: Contract = { ...contract, id: generateId(), createdAt: new Date().toISOString() };
    db.contracts.unshift(created);
    setDb(db);
    return created;
  },
  updateContractStatus(id: string, status: Contract['status']): void {
    const db = getDb();
    const c = db.contracts.find(x => x.id === id);
    if (c) { c.status = status; setDb(db); }
  },

  // Risk & Limits
  listRiskScores(): RiskScore[] { return getDb().riskScores; },
  updateRiskScore(partnerId: string, score: number, factors: string[]): RiskScore {
    const db = getDb();
    const existing = db.riskScores.find(r => r.partnerId === partnerId);
    const level = score >= 800 ? 'low' : score >= 600 ? 'medium' : score >= 400 ? 'high' : 'critical';
    
    if (existing) {
      existing.score = score;
      existing.level = level;
      existing.factors = factors;
      existing.lastUpdated = new Date().toISOString();
      setDb(db);
      return existing;
    }
    
    const created: RiskScore = { id: generateId(), partnerId, score, level, factors, lastUpdated: new Date().toISOString() };
    db.riskScores.unshift(created);
    setDb(db);
    return created;
  },
  listLimits(): Limit[] { return getDb().limits; },
  checkLimit(partnerId: string, amount: number, type: Limit['type']): boolean {
    const db = getDb();
    const today = new Date().toISOString().slice(0, 10);
    const thisMonth = new Date().toISOString().slice(0, 7);
    const period = type === 'daily' ? today : type === 'monthly' ? thisMonth : today;
    
    const limit = db.limits.find(l => l.partnerId === partnerId && l.type === type && l.period === period);
    if (!limit) return true; // No limit set
    
    return (limit.used + amount) <= limit.amount;
  },
  useLimit(partnerId: string, amount: number, type: Limit['type']): void {
    const db = getDb();
    const today = new Date().toISOString().slice(0, 10);
    const thisMonth = new Date().toISOString().slice(0, 7);
    const period = type === 'daily' ? today : type === 'monthly' ? thisMonth : today;
    
    let limit = db.limits.find(l => l.partnerId === partnerId && l.type === type && l.period === period);
    if (!limit) {
      limit = { id: generateId(), partnerId, type, amount: type === 'daily' ? 100000 : 1000000, used: 0, period, createdAt: new Date().toISOString() };
      db.limits.unshift(limit);
    }
    
    limit.used += amount;
    setDb(db);
  },

  // Invoices (Notas Fiscais)
  listInvoices(status?: InvoiceStatus): Invoice[] {
    const db = getDb();
    const all = db.invoices;
    return status ? all.filter(i => i.status === status) : all;
  },
  createInvoice(input: Omit<Invoice, "id" | "createdAt" | "status"> & { status?: InvoiceStatus }): Invoice {
    const db = getDb();
    const created: Invoice = { ...input, id: generateId(), createdAt: new Date().toISOString(), status: input.status ?? "pending" };
    db.invoices.unshift(created);
    setDb(db);
    return created;
  },
  setInvoiceStatus(id: string, status: InvoiceStatus): void {
    const db = getDb();
    const inv = db.invoices.find(x => x.id === id);
    if (inv) { inv.status = status; setDb(db); }
  },
  
  // Ensure all invoices have affiliateId linked
  ensureAllInvoicesHaveAffiliate(): void {
    const db = getDb();
    const affiliates = db.affiliates;
    
    if (affiliates.length === 0) {
      console.warn('No affiliates available to link invoices');
      return;
    }
    
    let fixedCount = 0;
    db.invoices.forEach(invoice => {
      if (!invoice.affiliateId) {
        // Link to a random affiliate
        const randomAffiliate = affiliates[Math.floor(Math.random() * affiliates.length)];
        invoice.affiliateId = randomAffiliate.id;
        
        // Also update partnerId if needed
        if (randomAffiliate.associatedPartnerIds && randomAffiliate.associatedPartnerIds.length > 0) {
          invoice.partnerId = randomAffiliate.associatedPartnerIds[0];
        }
        
        fixedCount++;
      }
    });
    
    if (fixedCount > 0) {
      console.log(`Fixed ${fixedCount} invoices by linking them to affiliates`);
      setDb(db);
    }
  },
  
  // Force fix all invoices - more aggressive approach
  forceFixAllInvoices(): void {
    const db = getDb();
    const affiliates = db.affiliates;
    
    if (affiliates.length === 0) {
      console.error('No affiliates available - cannot fix invoices');
      return;
    }
    
    let fixedCount = 0;
    let totalInvoices = db.invoices.length;
    
    db.invoices.forEach((invoice, index) => {
      if (!invoice.affiliateId) {
        // Use modulo to distribute evenly across affiliates
        const affiliateIndex = index % affiliates.length;
        const selectedAffiliate = affiliates[affiliateIndex];
        
        invoice.affiliateId = selectedAffiliate.id;
        
        if (selectedAffiliate.associatedPartnerIds && selectedAffiliate.associatedPartnerIds.length > 0) {
          invoice.partnerId = selectedAffiliate.associatedPartnerIds[0];
        }
        
        fixedCount++;
      }
    });
    
    console.log(`Force-fixed ${fixedCount} out of ${totalInvoices} invoices`);
    setDb(db);
  },

  // Bank Integrations
  listBankIntegrations(): BankIntegration[] { return getDb().bankIntegrations; },
  createBankIntegration(integration: Omit<BankIntegration, "id" | "lastSync">): BankIntegration {
    const db = getDb();
    const created: BankIntegration = { ...integration, id: generateId(), lastSync: new Date().toISOString() };
    db.bankIntegrations.unshift(created);
    setDb(db);
    return created;
  },
  updateBankIntegrationStatus(id: string, status: BankIntegration['status']): void {
    const db = getDb();
    const integration = db.bankIntegrations.find(x => x.id === id);
    if (integration) { 
      integration.status = status; 
      integration.lastSync = new Date().toISOString();
      setDb(db); 
    }
  },

  // Settlement Instructions
  listSettlementInstructions(): SettlementInstruction[] { return getDb().settlementInstructions; },
  createSettlementInstruction(instruction: Omit<SettlementInstruction, "id">): SettlementInstruction {
    const db = getDb();
    const created: SettlementInstruction = { ...instruction, id: generateId() };
    db.settlementInstructions.unshift(created);
    setDb(db);
    return created;
  },
  updateSettlementInstructionStatus(id: string, status: SettlementInstruction['status']): void {
    const db = getDb();
    const instruction = db.settlementInstructions.find(x => x.id === id);
    if (instruction) { 
      instruction.status = status; 
      if (status === 'confirmed' || status === 'failed') {
        instruction.executedDate = new Date().toISOString();
      }
      setDb(db); 
    }
  },

  // Volume Reports
  listVolumeReports(): VolumeReport[] { return getDb().volumeReports; },
  generateVolumeReport(partnerId: string, period: string): VolumeReport {
    const db = getDb();
    const partner = db.partners.find(p => p.id === partnerId);
    const charges = db.charges.filter(c => c.partnerId === partnerId);
    
    const totalVolume = charges.reduce((sum, c) => sum + c.amount, 0);
    const pendingCharges = charges.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0);
    const paidCharges = charges.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0);
    const contestedCharges = charges.filter(c => c.status === 'contested').reduce((sum, c) => sum + c.amount, 0);
    const averageTicket = charges.length > 0 ? totalVolume / charges.length : 0;
    
    const report: VolumeReport = {
      partnerId,
      partnerName: partner?.name || 'Unknown',
      period,
      totalVolume,
      pendingCharges,
      paidCharges,
      contestedCharges,
      averageTicket,
      transactionCount: charges.length,
      lastUpdated: new Date().toISOString()
    };
    
    // Update or create report
    const existingIndex = db.volumeReports.findIndex(r => r.partnerId === partnerId && r.period === period);
    if (existingIndex >= 0) {
      db.volumeReports[existingIndex] = report;
    } else {
      db.volumeReports.unshift(report);
    }
    
    setDb(db);
    return report;
  },

  // Enhanced Rate Management
  getActiveRate(partnerId: string, serviceId: string, amount: number): RateConfig | null {
    const db = getDb();
    const now = new Date().toISOString();
    
    return db.rates.find(rate => 
      rate.partnerId === partnerId && 
      rate.serviceId === serviceId && 
      rate.isActive &&
      rate.effectiveDate <= now &&
      (!rate.expirationDate || rate.expirationDate >= now) &&
      (!rate.minAmount || amount >= rate.minAmount) &&
      (!rate.maxAmount || amount <= rate.maxAmount)
    ) || null;
  },

  // Reconciliation
  addReconciliationItem(item: Omit<ReconciliationItem, "id">): ReconciliationItem {
    const db = getDb();
    const created: ReconciliationItem = { ...item, id: generateId() };
    db.reconciliation.unshift(created);
    setDb(db);
    return created;
  },
  updateReconciliationItemStatus(id: string, status: ReconciliationItem['status']): void {
    const db = getDb();
    const item = db.reconciliation.find(x => x.id === id);
    if (item) { 
      item.status = status; 
      setDb(db); 
    }
  },
  processReconciliationFile(fileData: Array<{referenceId: string, amount: number, transactionDate: string, bankCode?: string}>): void {
    const db = getDb();
    
    fileData.forEach(entry => {
      const existingCharge = db.charges.find(c => c.referenceId === entry.referenceId);
      const reconciliationItem: ReconciliationItem = {
        id: generateId(),
        referenceId: entry.referenceId,
        amountFile: entry.amount,
        amountSystem: existingCharge?.amount,
        matched: existingCharge ? Math.abs(existingCharge.amount - entry.amount) < 0.01 : false,
        partnerId: existingCharge?.partnerId,
        transactionDate: entry.transactionDate,
        bankCode: entry.bankCode,
        status: existingCharge ? (Math.abs(existingCharge.amount - entry.amount) < 0.01 ? 'matched' : 'discrepancy') : 'pending'
      };
      
      db.reconciliation.unshift(reconciliationItem);
    });
    
    setDb(db);
  }
};


