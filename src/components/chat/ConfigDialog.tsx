
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ConfigDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  sheetId: string;
  setSheetId: (sheetId: string) => void;
  onSave: () => void;
}

const ConfigDialog = ({ open, setOpen, sheetId, setSheetId, onSave }: ConfigDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restaurant Data Needed</DialogTitle>
          <DialogDescription>
            To provide restaurant recommendations, Resty needs access to a Google Sheet with restaurant data.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="sheet-id">Google Sheet ID</Label>
            <Input
              id="sheet-id"
              placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
              value={sheetId}
              onChange={(e) => setSheetId(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Find this in your Google Sheet URL: docs.google.com/spreadsheets/d/<strong>[THIS-IS-YOUR-SHEET-ID]</strong>/edit
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigDialog;
