import React from 'react'

const SectionContainer = ({children}) => {
  return (
    <section className='bg-slate-800 rounded-md shadow-md py-2 px-4 font-roboto flex flex-col gap-4'>
        {children}
    </section>
  )
}

export default SectionContainer