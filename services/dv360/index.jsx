import React from 'react'
import ServiceWrapper from './serviceWrapper'
import { getClients } from '@/libs/apis/data/home';

const ServicePage = async ({ serviceData }) => {

  const clientsResponse = await getClients();

  return (
    <>
      <ServiceWrapper serviceData={serviceData} clients={clientsResponse.data} />
    </>
  )
}

export default ServicePage