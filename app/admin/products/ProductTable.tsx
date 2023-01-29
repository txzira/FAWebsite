"use client";
import React, { useState, useEffect } from "react";

import Image from "next/image";
import { Product } from "@chec/commerce.js/types/product";
import { CSSTransition } from "react-transition-group";
import { Input } from "../../../components/FormComponents";

export default function ProductTable({ initProducts }: { initProducts: Product[] }) {
  const [products, setProducts] = useState(initProducts);
  const [productDetail, setProductDetail] = useState<Product>(products[0]);
  const [showModal, setShowModal] = useState(false);
  function showProductDetails(productObj) {
    setProductDetail(productObj);
    setShowModal(true);
    console.log(productDetail);
  }
  const fetcher = (url) => fetch(url).then((res) => res.json());

  // const { data, error } = useSWR(`/api/commercejs/getorders?page=${pageNum}&limit=${limit}`, fetcher);
  // console.log(products);\
  useEffect(() => {}, [productDetail]);
  return (
    <>
      <ProductDetailModal setShow={setShowModal} show={showModal} productObj={products[0]} />
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Price</th>
            <th>Shipping Allowed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product: Product) => (
            <tr>
              <td>
                <Image src={product.image.url} height={40} width={40} alt="Product Image" />
              </td>
              <td>{product.name}</td>
              <td>{product.price.formatted_with_symbol}</td>
              <td>{product.meta ? "Allowed" : "Not Allowed"}</td>
              <td>
                <button onClick={() => showProductDetails(product)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function ProductDetailModal({
  show,
  setShow,
  productObj,
}: {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  productObj: Product;
}) {
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

  return (
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
    </CSSTransition>
  );
}
