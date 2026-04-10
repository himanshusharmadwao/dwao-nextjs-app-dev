import React from 'react'
import ServiceWrapper from './serviceWrapper'

const ServicePage = async ({ serviceData, region = "default" }) => {

  return (
    <>
      <ServiceWrapper serviceData={serviceData} region={region} />
    </>
  )
}

export default ServicePage