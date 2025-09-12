'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from "@/hooks/useCartStore";
import Script from 'next/script';
import { toast } from 'sonner';

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  zipcode: string;
  place: string;
}

declare global {
  interface Window {
    Stripe: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    zipcode: '',
    place: ''
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [stripe, setStripe] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const { cart, isLoading, counter } = useCartStore();

  // Initialiser Stripe une fois le script chargé
  const initStripe = async () => {
    if (window.Stripe && !stripe) {
      try {
        const stripeInstance = window.Stripe('pk_test_51S6T2TDEoktufauXhlw8KTeGvzBhP5rVOz8Y3pXugdhRHwueaqkk9CuGce5RGDtGCd7lT5vk7AglzQiVj7eR4jMc00huwAlV1G');
        setStripe(stripeInstance);
        
        const elements = stripeInstance.elements();
        const cardElement = elements.create('card', { hidePostalCode: true });
        setCard(cardElement);
        
        // Attendre que l'élément soit monté dans le DOM
        setTimeout(() => {
          const cardContainer = document.getElementById('card-element');
          if (cardContainer) {
            cardElement.mount('#card-element');
          }
        }, 100);
        
        console.log("Stripe instance:", stripeInstance);
        console.log("Card element:", cardElement);
      } catch (error) {
        console.error('Error initializing Stripe:', error);
        setErrors(['Failed to initialize Stripe. Please refresh the page.']);
      }
    }
  };

  // Initialiser Stripe quand le script est chargé
  useEffect(() => {
    if (stripeLoaded) {
      initStripe();
    }
  }, [stripeLoaded, stripe]);

  // Gérer les changements de formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    if (!stripe || !card) {
      setErrors(['Stripe not initialized. Please wait and try again.']);
      return;
    }

    try {
      const result = await stripe.createToken(card);
      
      if (result.error) {
        setErrors(['Something went wrong with Stripe. Please try again']);
        console.error(result.error.message);
      } else {
        await stripeTokenHandler(result.token);
      }
    } catch (error) {
      setErrors(['Something went wrong. Please try again']);
      console.error(error);
    }
  };

  // Gérer le token Stripe
  const stripeTokenHandler = async (token: any) => {
    const order_items = cart?.cartItems.map(item => ({
      variant: item.variant.id, 
      quantity: item.quantity,
      item_subtotal: item.item_subtotal
    }));

    const data = {
      ...formData,
      order_items,
      stripe_token: token.id
    };

    try {
      const response = await fetch('/api/order/checkout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Vider le panier si vous avez une méthode pour ça
        // clearCart();
        toast.success("Checkout successful")
        // Rediriger vers la page de succès
        router.push('/');
      } else {
        throw new Error('Checkout failed');
      }
    } catch (error) {
      setErrors(['Something went wrong. Please try again']);
      console.error(error);
    }
  };

  return (
    <>
      {/* Utiliser Next.js Script pour charger Stripe */}
      <Script
        src="https://js.stripe.com/v3/"
        onLoad={() => {
          console.log('Stripe script loaded');
          setStripeLoaded(true);
        }}
        onError={() => {
          console.error('Failed to load Stripe script');
          setErrors(['Failed to load payment system. Please refresh the page.']);
        }}
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

            {/* Message si Stripe n'est pas encore chargé */}
            {!stripeLoaded && (
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
                Loading payment system...
              </div>
            )}

            {/* Tableau des articles */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Product</th>
                      <th className="text-left py-3 px-4 font-semibold">Price</th>
                      <th className="text-left py-3 px-4 font-semibold">Quantity</th>
                      <th className="text-left py-3 px-4 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart?.cartItems.map((item) => (
                      <tr key={item.variant.id} className="border-b">
                        <td className="py-3 px-4">{item.variant.product_name}</td>
                        <td className="py-3 px-4">${item.variant.discounted_price}</td>
                        <td className="py-3 px-4">{item.quantity}</td>
                        <td className="py-3 px-4">${item.item_subtotal}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 font-semibold">
                      <td className="py-3 px-4" colSpan={3}>Total</td>
                      <td className="py-3 px-4">${cart?.cart_subtotal}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Formulaire de livraison */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
              <p className="text-gray-500 mb-6">* All fields are required</p>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First name*
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last name*
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email*
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone*
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address*
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zip code*
                      </label>
                      <input
                        type="text"
                        name="zipcode"
                        value={formData.zipcode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Place*
                      </label>
                      <input
                        type="text"
                        name="place"
                        value={formData.place}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Affichage des erreurs */}
                {errors.length > 0 && (
                  <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {errors.map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}
                  </div>
                )}

                <hr className="my-6" />

                {/* Élément Stripe Card */}
                <div id="card-element" className="mb-6 p-3 border border-gray-300 rounded-md"></div>

                {counter > 0 && stripeLoaded && (
                  <>
                    <hr className="my-6" />
                    <button
                      type="submit"
                      disabled={isLoading || !stripe || !card}
                      className="w-full md:w-auto bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Processing...' : !stripe ? 'Loading payment...' : 'Pay with Stripe'}
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}