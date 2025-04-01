
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const DEFAULT_SHEET_ID = '1cIyJyPBm5i7ux7RLYIDBkXpJVjzDDiR0BrANuDKaJn0';

const Settings = () => {
  return (
    <div className="min-h-screen bg-resty-background">
      <Header />
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-resty-primary">Restaurant Data Settings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Restaurant Data Source</CardTitle>
            <CardDescription>
              Restaurant data is automatically loaded from a pre-configured Google Sheet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Google Sheet ID (Pre-configured)</Label>
                <div className="p-3 bg-gray-100 rounded border border-gray-200 text-gray-600 font-mono break-all">
                  {DEFAULT_SHEET_ID}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  This application is using a pre-configured Google Sheet for restaurant data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;
