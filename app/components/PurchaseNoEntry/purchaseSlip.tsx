import React from 'react';
import { Vendor, PurchaseEntryVendor, Item } from '../../Schema/purchaseWithoutEntry';
import Logo from '../../images/LogoBG.webp';

interface PurchaseSlipProps {
  vendorDetails: Vendor | undefined;
  purchase: PurchaseEntryVendor;
  getItemDetails: (itemId: string) => Item | null;
}

const PurchaseSlip: React.FC<PurchaseSlipProps> = ({ vendorDetails, purchase, getItemDetails }) => {
  return (
    <div className="p-8 bg-white ml-[200px] w-[500px]" id="purchase-slip">
      <div className="flex flex-col items-center mb-6">
        <div>
          <img src={Logo.src} className="w-16 h-16 mb-4" alt="Company Logo" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-1">WordScape Printing Company</h1>
          <p className="text-sm text-gray-600"> Lalitpur</p>
          <p className="text-sm text-gray-600">Phone: (+977) 9841000033</p>
        </div>
      </div>
      <h2 className="text-xl font-bold mb-6 text-center">Purchase Order Slip</h2>
      <div className="mb-6">
        <h3 className="text-lg font-semibold">{vendorDetails?.vendorName || 'Unknown Vendor'}</h3>
        <p className="text-sm text-gray-700">{vendorDetails?.vendorAddress || 'N/A'}</p>
        <p className="text-sm text-gray-700">VAT: {vendorDetails?.vendorVAT || 'N/A'}</p>
        <p className="text-sm text-gray-700">Phone: {vendorDetails?.vendorPhone || 'N/A'}</p>
      </div>
      <table className="w-full mb-6 border-collapse">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="text-left p-2">Item</th>
            <th className="text-right p-2">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {purchase.items.map((item, index) => {
            const itemDetails = getItemDetails(item.itemId);
            return (
              <tr key={index} className="border-b border-gray-200">
                <td className="p-2">{itemDetails?.itemName || 'Unknown Item'}</td>
                <td className="p-2 text-right">{item.quantityFromVendor}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">Thank you for doing business with us!</p>
      </div>
    </div>
  );
};

export default PurchaseSlip;