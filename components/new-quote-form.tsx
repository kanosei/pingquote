"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { createQuote } from "@/app/actions/quotes";
import { Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface QuoteItem {
  description: string;
  quantity: number;
  price: number;
}

interface Client {
  name: string;
  email: string | null;
}

interface LineItem {
  description: string;
  price: number;
  quantity: number;
}

interface NewQuoteFormProps {
  clients: Client[];
  lineItems: LineItem[];
}

export function NewQuoteForm({ clients, lineItems }: NewQuoteFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [discountType, setDiscountType] = useState<"none" | "percentage" | "fixed">("none");
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<QuoteItem[]>([
    { description: "", quantity: 1, price: 0 },
  ]);

  // Prepare autocomplete options
  const clientOptions = clients.map((client) => ({
    value: client.name,
    label: client.email ? `${client.name} (${client.email})` : client.name,
  }));

  const lineItemOptions = lineItems.map((item) => ({
    value: item.description,
    label: `${item.description} - ${formatCurrency(item.price)}`,
  }));

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  let discountAmount = 0;
  if (discount > 0 && discountType !== "none") {
    if (discountType === "percentage") {
      discountAmount = (subtotal * discount) / 100;
    } else {
      discountAmount = discount;
    }
  }
  const total = subtotal - discountAmount;

  function addItem() {
    setItems([...items, { description: "", quantity: 1, price: 0 }]);
  }

  function removeItem(index: number) {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof QuoteItem, value: string | number) {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  }

  // Handle client selection from autocomplete
  const handleClientSelect = (option: { value: string; label: string }) => {
    const selectedClient = clients.find(
      (c) => c.name.toLowerCase() === option.value.toLowerCase()
    );

    if (selectedClient) {
      setClientName(selectedClient.name);
      if (selectedClient.email) {
        setClientEmail(selectedClient.email);
      }
    }
  };

  // Handle line item selection from autocomplete
  const handleLineItemSelect = (index: number, option: { value: string; label: string }) => {
    const selectedItem = lineItems.find(
      (item) => item.description.toLowerCase() === option.value.toLowerCase()
    );

    if (selectedItem) {
      const newItems = [...items];
      newItems[index] = {
        description: selectedItem.description,
        quantity: selectedItem.quantity,
        price: selectedItem.price,
      };
      setItems(newItems);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate
    if (!clientName.trim()) {
      setError("Client name is required");
      setLoading(false);
      return;
    }

    const validItems = items.filter(item => item.description.trim() && item.price > 0);
    if (validItems.length === 0) {
      setError("At least one valid line item is required");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("clientName", clientName);
      formData.append("clientEmail", clientEmail);
      formData.append("discountType", discountType);
      formData.append("discount", discount.toString());
      formData.append("notes", notes);
      formData.append("items", JSON.stringify(validItems));

      const result = await createQuote(formData);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("Failed to create quote. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
          <CardDescription>Who is this quote for?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <AutocompleteInput
              id="clientName"
              options={clientOptions}
              value={clientName}
              onChange={setClientName}
              onSelect={handleClientSelect}
              placeholder="Start typing client name..."
              required
              disabled={loading}
            />
            {clientOptions.length > 0 && (
              <p className="text-xs text-gray-500">
                Start typing to see suggestions from previous clients
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientEmail">Client Email (Optional)</Label>
            <Input
              id="clientEmail"
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="client@example.com"
              disabled={loading}
            />
            <p className="text-xs text-gray-500">
              Add an email to enable sending the quote directly to your client
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
          <CardDescription>What are you quoting for?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="space-y-3 p-4 border rounded-lg bg-gray-50">
              {/* Description - Full width */}
              <div>
                <Label htmlFor={`description-${index}`}>Description</Label>
                <AutocompleteInput
                  id={`description-${index}`}
                  options={lineItemOptions}
                  value={item.description}
                  onChange={(value) => updateItem(index, "description", value)}
                  onSelect={(option) => handleLineItemSelect(index, option)}
                  placeholder="Start typing service/product..."
                  disabled={loading}
                />
              </div>

              {/* Quantity, Price, and Delete - Horizontal on mobile, better spacing */}
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label htmlFor={`quantity-${index}`}>Qty</Label>
                  <Input
                    id={`quantity-${index}`}
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", parseFloat(e.target.value) || 0)}
                    disabled={loading}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor={`price-${index}`}>Price</Label>
                  <Input
                    id={`price-${index}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => updateItem(index, "price", parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    disabled={loading}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1 || loading}
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Show line total on mobile */}
              <div className="text-sm text-gray-600 text-right font-medium">
                Total: {formatCurrency(item.quantity * item.price)}
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addItem}
            disabled={loading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Line Item
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Discount (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="discountType">Discount Type</Label>
              <select
                id="discountType"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as "none" | "percentage" | "fixed")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                disabled={loading}
              >
                <option value="none">No discount</option>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed amount</option>
              </select>
            </div>
            {discountType !== "none" && (
              <div className="flex-1">
                <Label htmlFor="discount">
                  {discountType === "percentage" ? "Percentage" : "Amount"}
                </Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  placeholder={discountType === "percentage" ? "10" : "100.00"}
                  disabled={loading}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Notes (Optional)</CardTitle>
          <CardDescription>Add any additional information</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Payment terms, delivery timeline, etc."
            rows={4}
            disabled={loading}
          />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Discount {discountType === "percentage" && `(${discount}%)`}
                </span>
                <span className="text-red-600">-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-semibold pt-2 border-t">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="mb-6 text-sm text-red-600 bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Creating..." : "Create Quote"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
