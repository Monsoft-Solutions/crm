# WhatsApp Settings API

All endpoints are in `mods/settings/api/` and use `protectedEndpoint` with permission checks.

## Queries

### getWhatsappNumbers

Returns all WhatsApp numbers available to the organization.

**File:** `mods/settings/api/get-whatsapp-numbers.query.ts`

**Sources merged:**
1. Twilio incoming phone numbers (from Twilio API)
2. DB records from `brand_whatsapp_number`

**Status sync:** Numbers with `senderStatus: 'creating'` are checked against Twilio's registered senders and updated to `'online'` if registration completed.

**Return shape:**
```typescript
{
  phoneNumber: string
  friendlyName: string
  id: string | null           // brand_whatsapp_number.id
  twilioSid: string | null
  senderStatus: 'offline' | 'online' | 'creating'
  isDefault: string | null
  brandId: string | null
  brandName: string | null
}[]
```

---

## Mutations

### assignWhatsappNumberBrand

Assigns or unassigns a phone number to/from a brand.

**File:** `mods/settings/api/assign-whatsapp-number-brand.mutation.ts`
**Schema:** `mods/settings/schemas/assign-whatsapp-number-brand.schema.ts`

**Input:**
```typescript
{ phoneNumber: string; brandId?: string }
```

**Behavior:**
- Deletes existing assignment for the phone number (org-scoped)
- If `brandId` is null/undefined, just unassigns
- Otherwise creates new assignment to the target brand
- First number for a brand is automatically set as default

---

### registerWhatsappSender

Registers a Twilio phone number as a WhatsApp sender.

**File:** `mods/settings/api/register-whatsapp-sender.mutation.ts`
**Schema:** `mods/settings/schemas/register-whatsapp-sender.schema.ts`

**Input:**
```typescript
{ phoneNumber: string }
```

**Behavior:**
- Gets org Twilio client
- Looks up Twilio phone number SID
- Calls `registerWhatsappSender` (from `bases/twilio/providers/`)
- Updates DB record with `twilioSid` and `senderStatus: 'creating'`
- Status transitions to `'online'` on next `getWhatsappNumbers` call (async check)

---

### setDefaultBrandWhatsappNumber

Sets which WhatsApp number is the default sender for a brand.

**File:** `mods/settings/api/set-default-brand-whatsapp-number.mutation.ts`

---

## UI Components

| Component | File | Purpose |
|-----------|------|---------|
| WhatsApp senders table | `mods/settings/components/whatsapp-senders-table.component.tsx` | Lists numbers with brand, status, actions |
| Setup guide | `mods/settings/components/whatsapp-setup-guide.component.tsx` | Instructions for Twilio WhatsApp setup |

## Settings View

The main settings page (`mods/settings/views/settings.view.tsx`) includes the WhatsApp senders table and setup guide.
