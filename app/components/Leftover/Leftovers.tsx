import { useEffect, useState } from 'react';
import { leftoverService } from '@/app/services/inventoryServices/leftoverService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import InventorySidebar from '../Sidebar/InventorySidebar';
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Package, BarChart2, AlertCircle, Info } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Leftover } from '../../Schema/leftOverSchema';
import { inventoryService } from '@/app/services/inventoryServices/inventoryservice';

export interface InventoryItem {
    _id: string;
    itemName: string;
    availability: number;
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
                    inventoryService.fetchInventory()
                ]);
                setLeftovers(leftoverData);
                setInventory(inventoryData.flatMap((type) => type.item));
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
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const truncateOrderId = (orderId: string) => {
        return orderId.length > 15 ? `${orderId.slice(0, 15)}...` : orderId;
    };
    return (
        <div className='flex h-screen bg-gray-100'>
            <InventorySidebar />
            <div className="flex-1 p-4 overflow-auto">
                <div className='flex gap-0'>
                    <h1 className="text-3xl  font-bold mt-[30px] mb-3 mr-[80px] text-gray-800">Leftover Items </h1>
                    <div className="mt-[5px] ml-[-70px]">
                        <span className="text-2xl font-normal text-gray-600 ml-2">
                            <HoverCard>
                                <HoverCardTrigger><Info className="hover:cursor-pointer hover:text-blue-900" /></HoverCardTrigger>
                                <HoverCardContent className="w-[300px] rounded-[20px]">
                                    <div className="p-[10px] items-center justify-center font-archivo">
                                        <h1 className="ml-[20px] font-semibold mb-[10px] text-[15px] text-gray-700">
                                            Information
                                        </h1>
                                        <p className=" ml-[20px] text-left text-gray-600 text-[15px]">
                                            This page provides information about the leftover items that were added to the inventory after the work was finished.
                                        </p>
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                        </span>
                    </div>
                </div>
                <div className="flex items-center mb-3 rounded-lg p-2">
                    <Search className="mr-2 text-gray-500" />
                    <Input
                        type="text"
                        placeholder="Search by Item Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-[315px] h-[40px] bg-white"
                    />
                </div>
                <div className="overflow-x-auto rounded-lg shadow">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow className="bg-gray-800 hover:bg-gray-800">
                                <TableHead className="font-semibold text-white px-6 py-3">
                                    <div className="flex items-center">
                                        <ShoppingCart className="mr-2" size={18} />
                                        Order ID
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold text-white px-6 py-3">
                                    <div className="flex items-center">
                                        <Package className="mr-2" size={18} />
                                        Item Name
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold text-white px-6 py-3">
                                    <div className="flex items-center">
                                        <BarChart2 className="mr-2" size={18} />
                                        Quantity
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold text-white px-6 py-3">
                                    <div className="flex items-center">
                                        <AlertCircle className="mr-2" size={18} />
                                        Reason
                                    </div>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredItems.map((item, index) => (
                                <TableRow key={`${item.order_id}-${item.item_id}-${index}`} className="hover:bg-gray-50 bg-white transition-colors">
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
    );
};

export default LeftoversPage;