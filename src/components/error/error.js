import React from 'react'
import { useDispatch } from 'react-redux'
import { RESET } from '../store/error/slice'

const Error = ({ message, open }) => {
  const dispatch = useDispatch()
  const cleanError = () => {
    dispatch(RESET());
  }
  return (
    <dialog className="modal bg-slate-200 bg-opacity-55" open={open} onClose={cleanError}>
      <div className="modal-box bg-white">
        <h3 className="font-bold text-lg">Error inesperado</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn bg-secondary">Cerrar</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}

export default Error
