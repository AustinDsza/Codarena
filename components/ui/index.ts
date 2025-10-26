/**
 * UI Components Index
 * 
 * This file exports all actively used UI components in the Codarena platform.
 * Components moved to /deprecated are not included here.
 * 
 * Active Components:
 * - Core UI: button, card, input, label, textarea, checkbox, radio-group, select, badge
 * - Material Design: material-button, material-card, material-input, material-badge
 * - Overlays: dialog, alert-dialog, popover, dropdown-menu
 * - Notifications: toast, toaster
 */

// Core UI Components
export { Button, buttonVariants } from "./button"
export { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
export { Input } from "./input"
export { Label } from "./label"
export { Textarea } from "./textarea"
export { Checkbox } from "./checkbox"
export { RadioGroup, RadioGroupItem } from "./radio-group"
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
export { Badge, badgeVariants } from "./badge"

// Material Design Components
export { MaterialButton } from "./material-button"
export { MaterialCard } from "./material-card"
export { MaterialInput } from "./material-input"
export { MaterialBadge } from "./material-badge"

// Overlay Components
export { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog"
export { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "./alert-dialog"
export { Popover, PopoverTrigger, PopoverContent } from "./popover"
export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./dropdown-menu"

// Notification Components
export { Toast, ToastAction, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "./toast"
export { Toaster } from "./toaster"
