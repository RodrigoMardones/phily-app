import { Button, Theme } from 'react-daisyui';

export default function Guideline() {
  return (
    <div>
      
      <>
      <Theme dataTheme="dark">
        <Button color="primary">Click me, dark!</Button>
      </Theme>

      <Theme dataTheme="light">
        <Button color="primary">Click me, light!</Button>
      </Theme>
      <button className="btn btn-primary">One</button>
      <button className="btn btn-secondary">Two</button>
      <button className="btn btn-accent btn-outline">Three</button>
      <Button color='primary'>four</Button>
      <Button color='secondary'>five</Button>
      <Button color="success">six</Button>
      <Button color='error'>error</Button>
    </>
    </div>
  )
}
