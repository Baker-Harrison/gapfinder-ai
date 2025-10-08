import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store';
import { Moon, Sun, Trash2, Sparkles, AlertTriangle, RefreshCw } from 'lucide-react';

export function Settings() {
  const { theme, toggleTheme, clearDatabase } = useStore();
  const [confirmClear, setConfirmClear] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [openRouterKey, setOpenRouterKey] = useState('');
  const [provider, setProvider] = useState<'gemini' | 'openrouter'>('gemini');
  const [selectedModel, setSelectedModel] = useState('');
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);

  useEffect(() => {
    // Load saved settings
    const savedGemini = localStorage.getItem('gemini_api_key');
    if (savedGemini) {
      setApiKey('••••••••••••••••••••');
    }
    
    const savedOpenRouter = localStorage.getItem('openrouter_api_key');
    if (savedOpenRouter) {
      setOpenRouterKey('••••••••••••••••••••');
    }
    
    const savedProvider = localStorage.getItem('ai_provider') as 'gemini' | 'openrouter' || 'gemini';
    setProvider(savedProvider);
    
    const savedModel = localStorage.getItem('selected_model');
    if (savedModel) {
      setSelectedModel(savedModel);
    }
    
    // Load models if OpenRouter is selected
    if (savedProvider === 'openrouter' && savedOpenRouter) {
      fetchAvailableModels(savedOpenRouter);
    }
  }, []);

  const handleClearDatabase = async () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 5000);
      return;
    }
    await clearDatabase();
    setConfirmClear(false);
    alert('Database cleared successfully!');
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim() && !apiKey.includes('•')) {
      localStorage.setItem('gemini_api_key', apiKey);
      setApiKey('••••••••••••••••••••');
      alert('Gemini API key saved securely!');
    }
  };
  
  const handleSaveOpenRouterKey = () => {
    if (openRouterKey.trim() && !openRouterKey.includes('•')) {
      localStorage.setItem('openrouter_api_key', openRouterKey);
      setOpenRouterKey('••••••••••••••••••••');
      fetchAvailableModels(openRouterKey);
      alert('OpenRouter API key saved securely!');
    }
  };
  
  const handleProviderChange = (newProvider: 'gemini' | 'openrouter') => {
    setProvider(newProvider);
    localStorage.setItem('ai_provider', newProvider);
    
    if (newProvider === 'openrouter') {
      const savedKey = localStorage.getItem('openrouter_api_key');
      if (savedKey) {
        fetchAvailableModels(savedKey);
      }
    }
  };
  
  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    localStorage.setItem('selected_model', model);
  };
  
  const fetchAvailableModels = async (apiKey: string) => {
    setLoadingModels(true);
    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch models');
      
      const data = await response.json();
      
      // Filter for free models only
      const freeModels = data.data.filter((model: any) => 
        model.pricing?.prompt === '0' || model.pricing?.prompt === 0
      );
      
      setAvailableModels(freeModels);
      
      // Auto-select first free model if none selected
      if (!selectedModel && freeModels.length > 0) {
        const defaultModel = freeModels[0].id;
        setSelectedModel(defaultModel);
        localStorage.setItem('selected_model', defaultModel);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      alert('Failed to fetch models. Check your API key.');
    } finally {
      setLoadingModels(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your learning experience
        </p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize how the app looks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark mode
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Question Generation
          </CardTitle>
          <CardDescription>
            Choose your AI provider and configure API access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Provider Selection */}
          <div className="space-y-2">
            <Label htmlFor="provider">AI Provider</Label>
            <select
              id="provider"
              value={provider}
              onChange={(e) => handleProviderChange(e.target.value as 'gemini' | 'openrouter')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="gemini">Google Gemini (Free)</option>
              <option value="openrouter">OpenRouter (Multiple Models)</option>
            </select>
          </div>
          
          {/* Gemini Configuration */}
          {provider === 'gemini' && (
            <div className="space-y-2">
              <Label htmlFor="gemini-key">Google Gemini API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="gemini-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key..."
                  className="flex-1"
                />
                <Button onClick={handleSaveApiKey}>
                  Save
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Get a free API key at <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a>
              </p>
            </div>
          )}
          
          {/* OpenRouter Configuration */}
          {provider === 'openrouter' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="openrouter-key">OpenRouter API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="openrouter-key"
                    type="password"
                    value={openRouterKey}
                    onChange={(e) => setOpenRouterKey(e.target.value)}
                    placeholder="Enter your OpenRouter API key..."
                    className="flex-1"
                  />
                  <Button onClick={handleSaveOpenRouterKey}>
                    Save
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Get a free API key at <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenRouter</a>
                </p>
              </div>
              
              {/* Model Selection */}
              {availableModels.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Select Model (Free Models Only)</Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        const key = localStorage.getItem('openrouter_api_key');
                        if (key) fetchAvailableModels(key);
                      }}
                      disabled={loadingModels}
                    >
                      <RefreshCw className={`h-4 w-4 ${loadingModels ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                  <select
                    id="model"
                    value={selectedModel}
                    onChange={(e) => handleModelChange(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select a model</option>
                    {availableModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name} - {model.id}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Showing {availableModels.length} free model(s)
                  </p>
                </div>
              )}
              
              {loadingModels && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Loading available models...
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            All data is stored locally on your device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
              <div className="space-y-1 flex-1">
                <p className="font-medium text-sm">Clear All Data</p>
                <p className="text-xs text-muted-foreground">
                  This will permanently delete all concepts, questions, and progress. This action cannot be undone.
                </p>
              </div>
            </div>
            <Button
              variant={confirmClear ? 'destructive' : 'outline'}
              className="w-full gap-2"
              onClick={handleClearDatabase}
            >
              <Trash2 className="h-4 w-4" />
              {confirmClear ? 'Click Again to Confirm' : 'Clear Database'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
