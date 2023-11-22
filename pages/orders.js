import Layout from '@/components/Layout';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  console.log(orders);
  useEffect(() => {
    axios.get('/api/order').then((response) => setOrders(response.data));
  }, []);
  return (
    <Layout>
      <h1>Commandes</h1>
      <table className='basic'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Destinataire</th>
            <th>Produits</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order) => (
              <tr>
                <td>{(new Date(order.createdAt)).toLocaleString()}</td>
                <td>
                  {order.firstName} {order.lastName} <br />
                  {order.email} <br />
                  {order.streetAddress} <br />
                  {order.postalCode} {order.city} <br />
                  {order.country} <br />
                </td>
                <td>
                  {order.line_items.map((l) => (
                    <>
                    {l.price_data.product_data.name} x {l.quantity}
                    </>
                  ))}
                </td>
                <td className={order.paid ? 'text-green-600' : 'text-red-600'}>{order.paid ? 'Payé' : 'Refusé'}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
