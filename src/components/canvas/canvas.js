import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTree } from '../store/tree/slice'

const Canvas = () => {
  const dispatch = useDispatch();
  const tree = useSelector(getTree);
  console.log(tree);
  return (
    <div>
      <div className="flex mx-auto m-4 bg-white ">
        <p>{tree.name}</p>
      </div>
    </div>
  )
}

export default Canvas
