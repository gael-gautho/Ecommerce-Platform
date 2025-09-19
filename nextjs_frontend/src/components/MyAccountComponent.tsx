"use client";

import UpdateButton from "@/components/UpdateButton";
import { updateUser } from "@/libs/actions";
import { format } from "timeago.js";
import { useActionState, useEffect, useState } from "react";
import { FormState, MyJwtPayload, Order, OrderItem, UserProfile } from "@/types";
import { toast } from "sonner";

interface MyAccountPageProps {
  orderRes: Order[];
  initialUserProfile: UserProfile;
}



const MyAccountComponent = ({ orderRes, initialUserProfile }: MyAccountPageProps) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const initialState: FormState = { success: false, message: '' };
  const [formState, formAction] = useActionState(updateUser, initialState);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);

  // Extraire tous les order items de toutes les commandes
  const allOrderItems: (OrderItem & { order_id: string; order_date: string; order_status: string })[] = [];
  
  orderRes.forEach(order => {
    order.order_items.forEach(item => {
      allOrderItems.push({
        ...item,
        order_id: order.id,
        order_date: order.created_at,
        order_status: order.status
      });
    });
  });

  useEffect(() => {
    if (formState.success && formState.updatedUser) {
      setUserProfile(formState.updatedUser);
      toast.success(formState.message || "Profile updated successfully!");
    } else if (formState.message) {
      toast.error(formState.message || "Failed to update profile");
    }
  }, [formState]);


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleViewOrder = (orderId: string) => {
    const order = orderRes.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-2">Manage your account and view your order items</p>
        </div>

        {/* Section 1: My Order Items - Tableau */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">My Order Items</h2>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {allOrderItems.length} items
            </span>
          </div>
          
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allOrderItems.map((item, index) => (
                  <tr key={`${item.order_id}-${item.variant.id}`} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img 
                            className="h-12 w-12 rounded-lg object-cover" 
                            src={item.variant.product_image_url} 
                            alt={item.variant.product_name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.variant.product_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex gap-2">
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                            {item.variant.color}
                          </span>
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                            {item.variant.size}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ${item.item_subtotal}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.order_date && format(item.order_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.order_status)}`}>
                        {item.order_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewOrder(item.order_id)}
                        className="inline-flex items-center px-4 py-2 bg-transparent hover:bg-blue-50 text-blue-600 text-sm font-medium rounded-lg transition-colors duration-150 border border-blue-300 hover:border-blue-400"
                      >
                        View Order
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: My Information - Formulaire horizontal */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">My Informations</h2>
            <p className="text-gray-600 mt-1">Update your personal details</p>
          </div>

          <form action={formAction} className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                    </label>
                    <input
                    type="text"
                    name="fullname" 
                    defaultValue={userProfile.fullname || ''}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                    </label>
                    <input
                    type="text"
                    name="phone_number" 
                    defaultValue={userProfile.phone_number || ''}
                    placeholder="+1234567890"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                    />
                </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                    </label>
                    <input
                    type="text"
                    name="address" 
                    defaultValue={userProfile.address || ''}
                    placeholder="123 Main St, Anytown"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                    />
                </div>
                
                <div className="flex items-end">
                    <UpdateButton />
                </div>

                
                </div>
            </form>
        </div>
    </div>

{isModalOpen && selectedOrder && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
    className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
    onClick={closeModal}
    ></div>

    <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
            <div>
                <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
                <p className="text-sm text-gray-600 mt-1">
                Order ID: #{selectedOrder.id.substring(0, 12)}...
                </p>
            </div>
            <button
                onClick={closeModal}
                className="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            </div>
        </div>

        {/* Content */}
        <div className="bg-white px-6 py-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {selectedOrder.first_name} {selectedOrder.last_name}</p>
                <p><span className="font-medium">Email:</span> {selectedOrder.email}</p>
                <p><span className="font-medium">Phone:</span> {selectedOrder.phone}</p>
                </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Order Information</h4>
                <div className="space-y-2 text-sm">
                <p><span className="font-medium">Date:</span> {format(selectedOrder.created_at)}</p>
                <p><span className="font-medium">Total:</span> <span className="font-bold">${selectedOrder.paid_amount}</span></p>
                <p>
                    <span className="font-medium">Status:</span>
                    <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                    </span>
                </p>
                </div>
            </div>
            </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-150"
            >
            Close
            </button>
        </div>
        </div>
    </div>
    )}
    </div>
  );
};

export default MyAccountComponent;