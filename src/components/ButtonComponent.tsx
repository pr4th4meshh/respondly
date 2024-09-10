import React, { ReactNode } from 'react'

interface IButtonProps {
    onClick?: () => void
    buttonBg: string
    buttonTitle: string
    icon?: ReactNode
}

const ButtonComponent = ({onClick, buttonBg, buttonTitle, icon}: IButtonProps) => {
  return (
    <button onClick={onClick} className={`px-3 py-2 text-md rounded flex items-center ${buttonBg}`}>{icon} {buttonTitle}</button>
  )
}

export default ButtonComponent