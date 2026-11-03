import { Children, cloneElement, isValidElement, useId } from 'react'

export default function AdminField({ label, children }) {
  const id = useId()
  return <div className="admin-field" role="group" aria-labelledby={`${id}-label`}><label id={`${id}-label`} htmlFor={id}>{label}</label>{Children.map(children, (child, index) => isValidElement(child) && index === 0 ? cloneElement(child, { id: child.props.id || id, 'aria-labelledby': `${id}-label` }) : child)}</div>
}
