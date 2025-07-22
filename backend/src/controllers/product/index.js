import Product from "../../models/product.js";
import Boom from "boom";
import ProductSchema from "./validations.js";

const Create = async (req, res, next) => {
	const input = req.body;
	const { error } = ProductSchema.validate(input);

	if (error) {
		return next(Boom.badRequest(error.details[0].message));
	}

	try {
		input.photos = JSON.parse(input.photos);

		const product = new Product(input);
		const savedData = await product.save();

		res.json(savedData);
	} catch (e) {
		next(e);
	}
};

const Get = async (req, res, next) => {
	const { product_id } = req.params;

	if (!product_id) {
		return next(Boom.badRequest("Missing paramter (:product_id)"));
	}

	try {
		const product = await Product.findById(product_id);

		res.json(product);
	} catch (e) {
		next(e);
	}
};

const Update = async (req, res, next) => {
	const { product_id } = req.params;

	try {
		const updated = await Product.findByIdAndUpdate(product_id, req.body, {
			new: true,
		});

		res.json(updated);
	} catch (e) {
		next(e);
	}
};

const Delete = async (req, res, next) => {
	const { product_id } = req.params;

	try {
		const deleted = await Product.findByIdAndDelete(product_id);

		if (!deleted) {
			throw Boom.badRequest("Product not found.");
		}

		res.json(deleted);
	} catch (e) {
		next(e);
	}
};

const GetList = async (req, res, next) => {
  const limit = 12; // Number of items per page
  const cursor = parseInt(req.query.cursor) || 0; // Cursor for pagination

  try {
    // Fetch products with pagination
    const products = await Product.find({})
      .sort({ createdAt: -1 }) // Sort by creation date
      .skip(cursor) // Skip items based on the cursor
      .limit(limit); // Limit the number of items

    // Check if there are more products
    const totalProducts = await Product.countDocuments();
    const hasNextPage = cursor + limit < totalProducts;

    res.json({
      data: products,
      hasNextPage,
      nextCursor: hasNextPage ? cursor + limit : null, // Provide the next cursor if more pages exist
    });
  } catch (error) {
    next(error);
  }
};

export default {
	Create,
	Get,
	Update,
	Delete,
	GetList,
};
