import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { usePixKeys, PixKey } from "@/contexts/PixKeysContext";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Copy,
  Download,
  Smartphone,
  Mail,
  User,
  Building,
  Key,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  Settings,
  Home,
  Calendar,
  Wallet,
  FileText,
  Menu
} from "lucide-react";
import { useState } from "react";

const PixGerenciarChaves = () => {
  const { logout } = useAuth();
  const { 
    pixKeys, 
    addPixKey, 
    updatePixKey, 
    removePixKey, 
    activatePixKey, 
    deactivatePixKey,
    validatePixKey,
    generateRandomKey
  } = usePixKeys();
  const navigate = useNavigate();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingKey, setEditingKey] = useState<PixKey | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    type: 'celular' as PixKey['type'],
    value: '',
    name: ''
  });
  const [formError, setFormError] = useState('');

  const getTypeIcon = (type: PixKey['type']) => {
    switch (type) {
      case 'celular': return <Smartphone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'cpf': return <User className="w-4 h-4" />;
      case 'cnpj': return <Building className="w-4 h-4" />;
      case 'aleatoria': return <Key className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: PixKey['type']) => {
    switch (type) {
      case 'celular': return 'Celular';
      case 'email': return 'E-mail';
      case 'cpf': return 'CPF';
      case 'cnpj': return 'CNPJ';
      case 'aleatoria': return 'Chave Aleatória';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Aqui você pode adicionar um toast
  };

  const handleAddKey = async () => {
    try {
      setFormError('');
      await addPixKey({
        type: formData.type,
        value: formData.value,
        name: formData.name || getTypeLabel(formData.type),
        isActive: true
      });
      setShowAddModal(false);
      setFormData({ type: 'celular', value: '', name: '' });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Erro ao adicionar chave');
    }
  };

  const handleEditKey = async () => {
    if (!editingKey) return;
    
    try {
      setFormError('');
      await updatePixKey(editingKey.id, {
        value: formData.value,
        name: formData.name || getTypeLabel(formData.type)
      });
      setEditingKey(null);
      setFormData({ type: 'celular', value: '', name: '' });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Erro ao editar chave');
    }
  };

  const handleDeleteKey = async (id: string) => {
    try {
      await removePixKey(id);
      setShowConfirmDelete(null);
    } catch (error) {
      console.error('Erro ao remover chave:', error);
    }
  };

  const handleToggleKey = async (key: PixKey) => {
    try {
      if (key.isActive) {
        await deactivatePixKey(key.id);
      } else {
        await activatePixKey(key.id);
      }
    } catch (error) {
      console.error('Erro ao alterar status da chave:', error);
    }
  };

  const openEditModal = (key: PixKey) => {
    setEditingKey(key);
    setFormData({
      type: key.type,
      value: key.value,
      name: key.name || ''
    });
  };

  const generateKey = () => {
    if (formData.type === 'aleatoria') {
      setFormData(prev => ({ ...prev, value: generateRandomKey() }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border/30 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/pix')}
            className="p-2 hover:bg-card transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-foreground text-base font-semibold block">Gerenciar Chaves PIX</span>
            <span className="text-muted-foreground text-xs">Adicionar, editar ou remover</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-primary text-xl font-bold tracking-tight">
            NEL<sup className="text-sm">3</sup><span className="text-destructive">+</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 py-6 pb-28 space-y-6">
        {/* Header com botão adicionar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Suas Chaves PIX</h1>
            <p className="text-muted-foreground">Gerencie suas chaves para receber pagamentos</p>
          </div>
                     <Button 
             onClick={() => setShowAddModal(true)}
             className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
           >
             <Plus className="w-4 h-4 mr-2" />
             Adicionar Chave
           </Button>
        </div>

                 {/* Lista de chaves */}
         <div className="space-y-4">
           {pixKeys.map((key) => (
             <div key={key.id} className="bg-card border border-border/30 rounded-xl p-5 hover:shadow-md transition-all duration-200">
                               <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                     key.isActive 
                       ? 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 border border-blue-200' 
                       : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500 border border-gray-200'
                   }`}>
                     {getTypeIcon(key.type)}
                   </div>
                   <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-3 mb-2">
                       <h3 className="font-semibold text-foreground text-base truncate">{key.name}</h3>
                       <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                         key.isActive 
                           ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-200' 
                           : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 border border-gray-200'
                       }`}>
                         {key.isActive ? 'Ativa' : 'Inativa'}
                       </span>
                     </div>
                     <p className="text-sm text-muted-foreground mb-1">{getTypeLabel(key.type)}</p>
                     <p className="text-sm font-mono text-foreground bg-muted/30 px-3 py-1 rounded-lg inline-block">
                       {key.value}
                     </p>
                   </div>
                 </div>
                 
                                   <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(key.value)}
                      className="text-muted-foreground hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors w-10 h-10"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowConfirmDelete(key.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors w-10 h-10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
               </div>
             </div>
           ))}

                     {pixKeys.length === 0 && (
             <div className="text-center py-16">
               <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-200">
                 <Key className="w-10 h-10 text-blue-600" />
               </div>
               <h3 className="text-xl font-semibold text-foreground mb-3">Nenhuma chave PIX cadastrada</h3>
               <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                 Adicione sua primeira chave PIX para começar a receber pagamentos instantâneos
               </p>
               <Button 
                 onClick={() => setShowAddModal(true)}
                 className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
               >
                 <Plus className="w-4 h-4 mr-2" />
                 Adicionar Primeira Chave
               </Button>
             </div>
           )}
        </div>
      </div>

             {/* Modal Adicionar/Editar Chave */}
       {(showAddModal || editingKey) && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
           <div className="bg-background rounded-2xl p-6 w-full max-w-md shadow-2xl border border-border/30">
             <div className="flex items-center justify-between mb-6">
               <div>
                 <h2 className="text-xl font-semibold text-foreground">
                   {editingKey ? 'Editar Chave PIX' : 'Adicionar Chave PIX'}
                 </h2>
                 <p className="text-sm text-muted-foreground mt-1">
                   {editingKey ? 'Modifique os dados da sua chave' : 'Configure uma nova chave para receber pagamentos'}
                 </p>
               </div>
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={() => {
                   setShowAddModal(false);
                   setEditingKey(null);
                   setFormData({ type: 'celular', value: '', name: '' });
                   setFormError('');
                 }}
                 className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
               >
                 <X className="w-4 h-4" />
               </Button>
             </div>

            <div className="space-y-4">
                             {/* Tipo de chave */}
               <div>
                 <Label htmlFor="type" className="text-sm font-medium text-foreground mb-2 block">
                   Tipo de Chave
                 </Label>
                 <select
                   id="type"
                   value={formData.type}
                   onChange={(e) => setFormData(prev => ({ 
                     ...prev, 
                     type: e.target.value as PixKey['type'],
                     value: e.target.value === 'aleatoria' ? generateRandomKey() : ''
                   }))}
                   className="w-full p-3 border border-border/50 rounded-xl bg-background text-foreground focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                 >
                   <option value="celular">📱 Celular</option>
                   <option value="email">📧 E-mail</option>
                   <option value="cpf">👤 CPF</option>
                   <option value="cnpj">🏢 CNPJ</option>
                   <option value="aleatoria">🔑 Chave Aleatória</option>
                 </select>
               </div>

                             {/* Valor da chave */}
               <div>
                 <Label htmlFor="value" className="text-sm font-medium text-foreground mb-2 block">
                   Valor da Chave
                 </Label>
                 <div className="flex gap-3">
                   <Input
                     id="value"
                     value={formData.value}
                     onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                     placeholder={
                       formData.type === 'celular' ? '11971981463' :
                       formData.type === 'email' ? 'seu@email.com' :
                       formData.type === 'cpf' ? '123.456.789-00' :
                       formData.type === 'cnpj' ? '12.345.678/0001-90' :
                       'pix-12345678'
                     }
                     className="flex-1 border-border/50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                   />
                   {formData.type === 'aleatoria' && (
                     <Button
                       type="button"
                       variant="outline"
                       onClick={generateKey}
                       className="shrink-0 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 rounded-xl"
                     >
                       🔄 Gerar
                     </Button>
                   )}
                 </div>
               </div>

                             {/* Nome da chave */}
               <div>
                 <Label htmlFor="name" className="text-sm font-medium text-foreground mb-2 block">
                   Nome da Chave <span className="text-muted-foreground">(opcional)</span>
                 </Label>
                 <Input
                   id="name"
                   value={formData.name}
                   onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                   placeholder={`Ex: ${getTypeLabel(formData.type)} Principal`}
                   className="border-border/50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                 />
               </div>

                             {/* Erro */}
               {formError && (
                 <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                   <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                   <span className="text-sm text-red-700 font-medium">{formError}</span>
                 </div>
               )}

                             {/* Botões */}
               <div className="flex gap-3 pt-6">
                 <Button
                   variant="outline"
                   onClick={() => {
                     setShowAddModal(false);
                     setEditingKey(null);
                     setFormData({ type: 'celular', value: '', name: '' });
                     setFormError('');
                   }}
                   className="flex-1 border-border/50 hover:bg-muted/50 rounded-xl"
                 >
                   Cancelar
                 </Button>
                 <Button
                   onClick={editingKey ? handleEditKey : handleAddKey}
                   className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg"
                 >
                   {editingKey ? 'Salvar Alterações' : 'Adicionar Chave'}
                 </Button>
               </div>
            </div>
          </div>
        </div>
      )}

             {/* Modal de confirmação de exclusão */}
       {showConfirmDelete && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
           <div className="bg-background rounded-2xl p-6 w-full max-w-md shadow-2xl border border-border/30">
             <div className="text-center">
               <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-200">
                 <AlertCircle className="w-8 h-8 text-red-600" />
               </div>
               <h3 className="text-xl font-semibold text-foreground mb-3">Remover Chave PIX</h3>
               <p className="text-muted-foreground mb-8 leading-relaxed">
                 Tem certeza que deseja remover esta chave PIX? 
                 <br />
                 <span className="font-medium text-foreground">Esta ação não pode ser desfeita.</span>
               </p>
               <div className="flex gap-3">
                 <Button
                   variant="outline"
                   onClick={() => setShowConfirmDelete(null)}
                   className="flex-1 border-border/50 hover:bg-muted/50 rounded-xl"
                 >
                   Cancelar
                 </Button>
                 <Button
                   onClick={() => handleDeleteKey(showConfirmDelete)}
                   className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl shadow-lg"
                 >
                   Remover Chave
                 </Button>
               </div>
             </div>
           </div>
         </div>
       )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/20 px-3 sm:px-6 py-3 sm:py-4">
        <div className="grid grid-cols-5 gap-2 sm:gap-4">
          <div 
            className="flex flex-col items-center gap-0.5 sm:gap-1 cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            <Home className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
            <span className="text-muted-foreground text-xs">Início</span>
          </div>
          <div 
            className="flex flex-col items-center gap-0.5 sm:gap-1 cursor-pointer"
            onClick={() => navigate('/agenda')}
          >
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
            <span className="text-muted-foreground text-xs">Agenda</span>
          </div>
          <div 
            className="flex flex-col items-center gap-0.5 sm:gap-1 cursor-pointer"
            onClick={() => navigate('/carteira')}
          >
            <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
            <span className="text-muted-foreground text-xs">Carteira</span>
          </div>
          <div 
            className="flex flex-col items-center gap-0.5 sm:gap-1 cursor-pointer"
            onClick={() => navigate('/historico')}
          >
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
            <span className="text-muted-foreground text-xs">Histórico</span>
          </div>
          <div 
            className="flex flex-col items-center gap-0.5 sm:gap-1 cursor-pointer"
            onClick={() => navigate('/menu')}
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
            <span className="text-muted-foreground text-xs">Menu</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixGerenciarChaves;
