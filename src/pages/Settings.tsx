
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
  const [googleSheetId, setGoogleSheetId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved Google Sheet ID from localStorage
    const savedGoogleSheetId = localStorage.getItem('google_sheet_id');
    if (savedGoogleSheetId) setGoogleSheetId(savedGoogleSheetId);
  }, []);

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      // Save Google Sheet ID to localStorage
      localStorage.setItem('google_sheet_id', googleSheetId);
      
      toast({
        title: "Settings saved",
        description: "Your restaurant data source has been configured successfully.",
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
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-resty-primary">Restaurant Data Settings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Restaurant Data Source</CardTitle>
            <CardDescription>
              Configure your Google Sheet containing restaurant information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="google-sheet-id">Google Sheet ID</Label>
                <Input
                  id="google-sheet-id"
                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  value={googleSheetId}
                  onChange={(e) => setGoogleSheetId(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Find the Sheet ID in the URL of your Google Sheet: docs.google.com/spreadsheets/d/<strong>[THIS-IS-YOUR-SHEET-ID]</strong>/edit
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Make sure your Google Sheet is set to "Anyone with the link can view".
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Your Google Sheet must have column headers matching the restaurant data format.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end mt-6">
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
      </main>
      <Footer />
    </div>
  );
};

export default Settings;
