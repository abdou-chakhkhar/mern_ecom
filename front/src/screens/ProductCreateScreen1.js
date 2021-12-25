import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { createProduct, listProductDetails, updateProduct } from '../actions/productAction'
import { PRODUCT_UPDATE_RESET } from '../constants/productsConstants'

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id

  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '',
    // categories: [],
    category: '',
    //shipping: '',
    countInStock: '',
    photo: '',
    //loading: false,
    //error: '',
    //createdProduct: '',
    //redirectToProfile: false,
    brand: '',
    uploading: false,
    formData: new FormData()
});


const{
  name,
  description,
  price,
  // categories: [],
  category,
  //shipping: '',
  countInStock,
  photo,
  //loading: false,
  //error: '',
  //createdProduct: '',
  //redirectToProfile: false,
  brand,
  uploading,
  formData
} = values;

  //const [name, setName] = useState('')
  //const [price, setPrice] = useState(0)
  //const [image, setImage] = useState('')
  //const [photo, setPhoto] = useState('')
  //const [brand, setBrand] = useState('')
  //const [category, setCategory] = useState('')
  //const [countInStock, setCountInStock] = useState(0)
  //const [description, setDescription] = useState('')
  //const [uploading, setUploading] = useState(false)

  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const productUpdate = useSelector((state) => state.productUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate

//   useEffect(() => {
//     if (successUpdate) {
//       dispatch({ type: PRODUCT_UPDATE_RESET })
//       history.push('/admin/productlist')
//     } else {
//       if (!product.name || product._id !== productId) {
//         dispatch(listProductDetails(productId))
//       } else {
//         setName(product.name)
//         setPrice(product.price)
//         setImage(product.image)
//         setBrand(product.brand)
//         setCategory(product.category)
//         setCountInStock(product.countInSock)
//         setDescription(product.description)
//       }
//     }
//   }, [dispatch, history, productId, product, successUpdate])

  // const uploadFileHandler = async (e) => {
  //   const file = e.target.files[0]
  //   const formData = new FormData()
  //   formData.append('image', file)
  //   setUploading(true)

  //   try {
  //     const config = {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     }

  //     console.log('hiho');
  //     const { data } = await axios.post('/api/upload', formData, config)
  //     console.log('kkk');
  //     setImage(data)
  //     setUploading(false)
  //   } catch (error) {
  //     console.error(error)
  //     setUploading(false)
  //   }
  // }





  const submitHandler = (e) => {
    e.preventDefault()
    console.log(formData);
    dispatch(
        createProduct(formData)
    )
  }

  const handleChange = name => event => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value;
    // console.log(event.target.files[0]);
    formData.set(name, value);
    setValues({ ...values, [name]: value });
};

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Create Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={name}
                onChange={handleChange('name')}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='price'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={handleChange('price')}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='image'>
              <Form.Label>Image</Form.Label>
              {/* <Form.Control
                type='text'
                placeholder='Enter image url'
                value={image}
                onChange={setImage(e.target.value)}
              ></Form.Control> */}
              <Form.File
                id='image-file'
                label='Choose File'
                // multiple
                custom
                onChange={handleChange('photo')}
              ></Form.File>
              {uploading && <Loader />}
            </Form.Group>

            {/* <div className="form-group">
                <label className="btn btn-secondary">
                    <input onChange={handleChange('photo')} type="file" name="photo" accept="image/*" />
                </label>
            </div> */}


            <Form.Group controlId='brand'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter brand'
                value={brand}
                onChange={handleChange('brand')}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='countInStock'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter countInStock'
                value={countInStock}
                onChange={handleChange('countInStock')}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='category'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter category'
                value={category}
                onChange={handleChange('category')}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={handleChange('description')}
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
              Create
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default ProductEditScreen