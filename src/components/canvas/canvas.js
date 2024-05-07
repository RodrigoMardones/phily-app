import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTree } from '../store/tree/slice'
import { Card } from 'react-daisyui'
import Dendrogram from '../dendrogram/dendrogram'
import ZoomableSVG from '../zoomable/zoomable'

const Canvas = () => {
  const tree = useSelector(getTree)
  console.log(tree)
  return (
    <Card className="bg-white m-4 rounded-none border-none w-5/6">
      <div className="flex justify-center items-center h-full">
        {tree.name && (
          <ZoomableSVG>
            <Dendrogram
              data={tree.tree}
              width={900}
              height={900}
              normalize={tree.normalize}
              curveType={tree.curveType}
            />
          </ZoomableSVG>
        )}
      </div>
    </Card>
  )
}

export default Canvas
