import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'
import formidable from 'formidable'


// @desc Fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async(req, res) => {
    const products = await Product.find({})
    res.json(products)
})

// @desc Fetch single product
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    
    if(product) {
        res.json(product)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
  
    if (product) {
      await product.remove()
      res.json({ message: 'Product removed' })
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
  })
  
  // @desc    Create a product
  // @route   POST /api/products
  // @access  Private/Admin
  // const createProduct = asyncHandler(async (req, res) => {
  //   //console.log(req.body);
  //   // const product = new Product({
  //   //   name: 'Sample name',
  //   //   price: 0,
  //   //   user: req.user._id,
  //   //   image: '/images/sample.jpg',
  //   //   brand: 'Sample brand',
  //   //   category: 'Sample category',
  //   //   countInStock: 0,
  //   //   numReviews: 0,
  //   //   description: 'Sample description',
  //   // })

  //   // const product = new Product({
  //   //   name: 'Sample name',
  //   //   price: 0,
  //   //   user: req.user._id,
  //   //   image: req.body.photo,
  //   //   brand: 'Sample brand',
  //   //   category: 'Sample category',
  //   //   countInStock: 0,
  //   //   numReviews: 0,
  //   //   description: 'Sample description',
  //   // })
  //   // const product = new Product({
  //   //   user: req.user._id,
  //   //   ...req.body
  //   // })
  
  //   // const createdProduct = await product.save()
  //   // res.status(201).json(createdProduct)

  //   console.log('prodcut controller create');


  //   let form = new formidable.IncomingForm();
  //   console.log(form);
  //   form.keepExtensions = true;
  //   form.parse(req, (err, fields, files) => {
  //     console.log(fields);
  //       if (err) {
  //           return res.status(400).json({
  //               error: 'Image could not be uploaded'
  //           });
  //       }
  //       // // check for all fields
  //       // const { name, description, price, category, quantity, shipping } = fields;

  //       // if (!name || !description || !price || !category || !quantity || !shipping) {
  //       //     return res.status(400).json({
  //       //         error: 'All fields are required'
  //       //     });
  //       // }

  //       let product = new Product(fields);

  //       // // 1kb = 1000
  //       // // 1mb = 1000000

  //       if (files.photo) {
  //           // console.log("FILES PHOTO: ", files.photo);
  //           if (files.photo.size > 1000000) {
  //               return res.status(400).json({
  //                   error: 'Image should be less than 1mb in size'
  //               });
  //           }
  //           console.log('jaja');
  //           product.photo.data = fs.readFileSync(files.photo.path);
  //           product.photo.contentType = files.photo.type;
  //       }

  //       product.save((err, result) => {
  //           if (err) {
  //               console.log('PRODUCT CREATE ERROR ', err);
  //               return res.status(400).json({
  //                   error: errorHandler(err)
  //               });
  //           }
  //           res.json(result);
  //       });
  //   });
    
  // })

  const createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
        // check for all fields
        const { name, description, price, category, quantity, shipping } = fields;

        if (!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        let product = new Product(fields);

        // 1kb = 1000
        // 1mb = 1000000

        if (files.photo) {
            // console.log("FILES PHOTO: ", files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if (err) {
                console.log('PRODUCT CREATE ERROR ', err);
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};
  
  // @desc    Update a product
  // @route   PUT /api/products/:id
  // @access  Private/Admin
  const updateProduct = asyncHandler(async (req, res) => {
    const {
      name,
      price,
      description,
      image,
      brand,
      category,
      countInStock,
    } = req.body
  
    console.log(req.body);
    const product = await Product.findById(req.params.id)
  
    if (product) {
      product.name = name
      product.price = price
      product.description = description
      product.image = image
      product.brand = brand
      product.category = category
      product.countInStock = countInStock
  
      const updatedProduct = await product.save()
      res.json(updatedProduct)
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
  })
  

// @desc Create new review
// @route POST /api/products/:id/reviews
// @access Private
const createProductReview = asyncHandler(async( req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)

  if(product){
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if( alreadyReviewed ){
      res.status(400)
      throw new Error('Product already reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id
    }

    product.reviews.push(review)

    product.rating = 
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length


    await product.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }

})


  export {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview
  }