import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import StoreContext from '../../../components/Store/Context';

const RoutesPrivate = ({ component: Component, user, ...rest}) => {
  const { token } = useContext(StoreContext);

  console.log(token)
 
  return (
  <div>
    <Route
      {...rest}
      render={() => token
        ? <Component {...rest} />
        : <Redirect to="/" />
      }
    />
    </div>
  )
}

export default RoutesPrivate;