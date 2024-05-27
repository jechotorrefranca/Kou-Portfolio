import React from 'react'

const Alert = ({ type, text }) => {
  return (
    <div className="absolute top-100 left-0 right-0 flex justify-center items-center">
        <div className={`${type === 'danger' ? 'bg-red-800' : 'bg-blue-800'} p-2 text-indigo-100 leading-none rounded-full
        flex lg:inline-flex items-center`} role='alert'>
            <p className={`${type === 'danger' ? 'bg-red-400' : 'bg-blue-400'} flex rounded-full uppercase px-4 py-2 font-bold mr-3 text-xs font-cocogoose`}>{type === 'danger' ? 'Failed' : 'Success'}</p>
            <p className='mr-2 text-left font-cocogoose'>{text}</p>
        </div>

    </div>
  )
}

export default Alert