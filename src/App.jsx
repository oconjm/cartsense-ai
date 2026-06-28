import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "./firebase";

function App() {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    const cartRef = ref(db, "cart");

    const unsubscribe = onValue(cartRef, (snapshot) => {
      const data = snapshot.val();

      console.log(data);

      setCart(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>CartSense Dashboard</h1>

      {cart ? (
        <>
          <h2>Item: {cart.item}</h2>
          <h2>Quantity: {cart.qty}</h2>
          <h2>Weight: {cart.weight} g</h2>
        </>
      ) : (
        <p>Waiting for data...</p>
      )}
    </div>
  );
}

export default App;
