import React from 'react'
import { useDispatch } from 'react-redux'
import { RESET } from '../store/error/slice'

const Error = ({ message, open }) => {
  const dispatch = useDispatch()
  const cleanError = () => {
    dispatch(RESET());
  }
  return (
    <dialog className="modal" open={open} onClose={cleanError}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Hello!</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Cerrar</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}

export default Error
