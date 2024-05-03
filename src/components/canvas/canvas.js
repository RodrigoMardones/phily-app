import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTree } from '../store/tree/slice'
import { Card } from 'react-daisyui'

const Canvas = () => {
  const dispatch = useDispatch();
  const tree = useSelector(getTree);
  console.log(tree);
  return (
        <Card className='bg-white m-4 rounded-none border-none w-5/6'>
          <div className='flex justify-center items-center h-full'>
            <h1 className='text-2xl font-bold text-gray-900'>{tree.name}</h1>
          </div>
        </Card>
  )
}

export default Canvas
