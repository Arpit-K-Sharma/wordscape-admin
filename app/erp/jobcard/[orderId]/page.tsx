"use client"
import JobCardPage from "../_components/jobcard"

const page = ({ params }: { params: { orderId: string } }) => {
    return (
        <div>
            <JobCardPage ordersId={params.orderId}/>
        </div>
    )
}

export default page


