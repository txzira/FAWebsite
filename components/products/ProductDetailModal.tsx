import type { Product } from "@chec/commerce.js/types/product";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import { Input } from "../FormComponents";

const ProductDetailModal = ({
  show,
  setShow,
  productObj,
}: {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  productObj: Product;
}) => {
  const [name, setName] = useState(productObj.name);

  function closeProductDetails() {
    setShow(false);
  }

  function closeOnEscKeyDown(event) {
    if ((event.charCode || event.keyCode) === 27) closeProductDetails();
  }

  useEffect(() => {
    document.body.addEventListener("keydown", closeOnEscKeyDown);
    return function cleanup() {
      document.body.removeEventListener("keydown", closeOnEscKeyDown);
    };
  }, []);

  return ReactDOM.createPortal(
    <CSSTransition in={show} unmountOnExit timeout={{ enter: 0, exit: 300 }}>
      <div className="modal" onClick={() => closeProductDetails()}>
        <div className="modal-content" onClick={(event) => event.stopPropagation()}>
          {productObj && (
            <>
              <div className="modal-header">
                <div className="flex justify-between items-center">
                  <span className="modal-title">{productObj.name}</span>
                </div>
              </div>
              <div className="modal-body">
                <form>
                  <Input
                    id="productName"
                    value={name}
                    name="productName"
                    labelText="Product Name"
                    onChange={(event) => setName(event.target.value)}
                  />
                </form>
              </div>
              <div className="modal-footer"></div>
            </>
          )}
        </div>
      </div>
    </CSSTransition>,
    document.getElementById("__next")
  );
};

export default ProductDetailModal;
