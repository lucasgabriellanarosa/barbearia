import React from 'react'

interface Props {
  children: React.ReactNode;
}

const SectionContainer = ({children}: Props) => {
  return (
    <section className='bg-slate-800 rounded-md shadow-md py-2 px-4 font-roboto flex flex-col gap-3'>
        {children}
    </section>
  )
}

export default SectionContainer