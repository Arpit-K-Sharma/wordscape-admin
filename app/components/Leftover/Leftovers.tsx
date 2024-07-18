import { useEffect, useState } from 'react';
import {leftoverService} from '@/app/services/leftoverService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import InventorySidebar from '../Sidebar/InventorySidebar';
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Package, BarChart2, AlertCircle } from 'lucide-react';

export interface Item {
    item_id: string;
    quantity: number;
    reason: string;
    itemName?: string;
}

export interface Leftover {
    _id: string;
    order_id: string;
    items: Item[];
}

export interface InventoryItem {
    _id: string;
    itemName: string;
    availability: number;
}

export interface InventoryType {
    _id: string;
    type: string;
    item: InventoryItem[];
}

export interface InventoryResponse {
    status: string;
    status_code: number;
    data: InventoryType[];
}

const LeftoversPage = () => {
    const [leftovers, setLeftovers] = useState<Leftover[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [leftoverData, inventoryData] = await Promise.all([
                    leftoverService.fetchLeftover(),
                    leftoverService.fetchInventory()
                ]);
                setLeftovers(leftoverData);
                setInventory(inventoryData.data.flatMap(type => type.item));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const getItemName = (itemId: string): string => {
        const item = inventory.find(i => i._id === itemId);
        return item ? item.itemName : 'Unknown Item';
    };

    const flattenedItems = leftovers.flatMap(leftover =>
        leftover.items.map(item => ({
            ...item,
            order_id: leftover.order_id,
            itemName: getItemName(item.item_id)
        }))
    );

    const filteredItems = flattenedItems.filter(item =>
        item.order_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const truncateOrderId = (orderId: string) => {
        return orderId.length > 15 ? `${orderId.slice(0, 15)}...` : orderId;
    };
    return (
        <div className='flex h-screen bg-gray-100'>
            <InventorySidebar />
            <div className="flex-1 p-10 overflow-auto">
                <div className="bg-[white] rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">Items Added to Inventory</h1>
                    <div className="flex items-center mb-6 rounded-lg p-2">
                        <Search className="mr-2 text-gray-500" />
                        <Input
                            type="text"
                            placeholder="Search by Order ID"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-[300px] h-[40px]"
                        />
                    </div>
                    <div className="overflow-x-auto rounded-lg shadow">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow className="bg-gray-200">
                                    <TableHead className="font-semibold text-gray-700 px-6 py-4">
                                        <div className="flex items-center">
                                            <ShoppingCart className="mr-2" size={18} />
                                            Order ID
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-semibold text-gray-700 px-6 py-4">
                                        <div className="flex items-center">
                                            <Package className="mr-2" size={18} />
                                            Item Name
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-semibold text-gray-700 px-6 py-4">
                                        <div className="flex items-center">
                                            <BarChart2 className="mr-2" size={18} />
                                            Quantity
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-semibold text-gray-700 px-6 py-4">
                                        <div className="flex items-center">
                                            <AlertCircle className="mr-2" size={18} />
                                            Reason
                                        </div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredItems.map((item, index) => (
                                    <TableRow key={`${item.order_id}-${item.item_id}-${index}`} className="hover:bg-gray-50 transition-colors">
                                        <TableCell className="px-6 py-4 text-gray-600">{truncateOrderId(item.order_id)}</TableCell>
                                        <TableCell className="px-6 py-4 text-gray-600">{item.itemName}</TableCell>
                                        <TableCell className="px-6 py-4 text-gray-600">{item.quantity}</TableCell>
                                        <TableCell className="px-6 py-4 text-gray-600">{item.reason}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeftoversPage;