
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const Settings = () => {
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [googleSheetsApiKey, setGoogleSheetsApiKey] = useState('');
  const [googleSheetId, setGoogleSheetId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved API keys from localStorage
    const savedOpenaiKey = localStorage.getItem('openai_api_key');
    const savedGoogleSheetsKey = localStorage.getItem('google_sheets_api_key');
    const savedGoogleSheetId = localStorage.getItem('google_sheet_id');

    if (savedOpenaiKey) setOpenaiApiKey(savedOpenaiKey);
    if (savedGoogleSheetsKey) setGoogleSheetsApiKey(savedGoogleSheetsKey);
    if (savedGoogleSheetId) setGoogleSheetId(savedGoogleSheetId);
  }, []);

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      // Save API keys to localStorage
      localStorage.setItem('openai_api_key', openaiApiKey);
      localStorage.setItem('google_sheets_api_key', googleSheetsApiKey);
      localStorage.setItem('google_sheet_id', googleSheetId);
      
      toast({
        title: "Settings saved",
        description: "Your API keys have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-resty-background">
      <Header />
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-resty-primary">API Settings</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>OpenAI API Settings</CardTitle>
              <CardDescription>
                Configure your OpenAI API key for the chatbot functionality.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai-api-key">OpenAI API Key</Label>
                  <Input
                    id="openai-api-key"
                    type="password"
                    placeholder="sk-..."
                    value={openaiApiKey}
                    onChange={(e) => setOpenaiApiKey(e.target.value)}
                  />
                  <p className="text-sm text-gray-500">
                    Get your API key from the <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-resty-primary">OpenAI dashboard</a>.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Google Sheets API Settings</CardTitle>
              <CardDescription>
                Configure your Google Sheets API settings to access restaurant data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="google-sheets-api-key">Google Sheets API Key</Label>
                  <Input
                    id="google-sheets-api-key"
                    type="password"
                    placeholder="AIza..."
                    value={googleSheetsApiKey}
                    onChange={(e) => setGoogleSheetsApiKey(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="google-sheet-id">Google Sheet ID</Label>
                  <Input
                    id="google-sheet-id"
                    placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                    value={googleSheetId}
                    onChange={(e) => setGoogleSheetId(e.target.value)}
                  />
                  <p className="text-sm text-gray-500">
                    Find the Sheet ID in the URL of your Google Sheet: docs.google.com/spreadsheets/d/[THIS-IS-YOUR-SHEET-ID]/edit
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={saveSettings} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving
                </>
              ) : (
                'Save Settings'
              )}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;
