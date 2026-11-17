"use client";

import GuestCheckoutModal from "@/components/ui/Modals/guestCheckoutModal";
import AddressModal from "@/components/ui/Modals/new-address-modal";
import CheckoutModal from "@/components/ui/cart/CheckoutModal";
import { CartItem } from "@/store/cart/cartSlice";
import { Address } from "@/types/global";

interface CartPageDialogsProps {
  checkoutModalOpen: boolean;
  guestModalOpen: boolean;
  addressModalOpen: boolean;
  cartItems: CartItem[];
  selectedItems: Record<string, boolean>;
  onCloseCheckout: () => void;
  onOpenGuestCheckout: () => void;
  onCloseGuestCheckout: () => void;
  onCloseAddress: () => void;
  onSaveAddress: (savedAddress: Address) => void;
}

export default function CartPageDialogs({
  checkoutModalOpen,
  guestModalOpen,
  addressModalOpen,
  cartItems,
  selectedItems,
  onCloseCheckout,
  onOpenGuestCheckout,
  onCloseGuestCheckout,
  onCloseAddress,
  onSaveAddress,
}: CartPageDialogsProps) {
  return (
    <>
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={onCloseCheckout}
        onGuestCheckout={() => {
          onCloseCheckout();
          onOpenGuestCheckout();
        }}
      />
      <GuestCheckoutModal
        isEditing={false}
        isOpen={guestModalOpen}
        onClose={onCloseGuestCheckout}
        selectedItems={cartItems
          .filter((item) => selectedItems[item.variation_id || item.id])
          .map((item) => ({
            product_id: item.id,
            variation_id: item.variation_id,
            quantity: item.quantity,
            checked: true,
          }))}
      />
      <AddressModal
        isOpen={addressModalOpen}
        isEdit={false}
        onClose={onCloseAddress}
        onSave={onSaveAddress}
      />
    </>
  );
}
