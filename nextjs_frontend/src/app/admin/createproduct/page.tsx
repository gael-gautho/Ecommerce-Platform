"use client";

import { useState, useEffect } from "react";
import { ProductDetailInterface } from "@/types";
import apiService from "@/libs/apiService";
import { toast } from "sonner";

type VariantForm = {
  color: string;
  size: string;
  stock_quantity: number;
  price: number;
  discounted_price: number;
};

type OtherImageForm = {
  image: File;
}

const CreateProductPage = () => {
  const [formData, setFormData] = useState<Partial<ProductDetailInterface>>({
    category: "",
    name: "",
    slug: "",
    description: "",

  });

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [otherImageFiles, setOtherImageFiles] = useState<OtherImageForm[]>([]);
  const [variants, setVariants] = useState<VariantForm[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  // Generate variants when colors or sizes change
  useEffect(() => {
  if (!formData.color_options || !formData.size_options) return;

  const newVariants: VariantForm[] = [];
  formData.color_options.forEach((color) => {
    formData.size_options!.forEach((size) => {
      const existing = variants.find(
        (v) => v.color === color && v.size === size
      );
      newVariants.push(
        existing || {
          color,
          size,
          stock_quantity: 0,
          price: 0,
          discounted_price: 0,
        }
      );
    });
  });

  setVariants(newVariants);
}, [formData.color_options, formData.size_options]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddArrayValue = (
    field: "color_options" | "size_options",
    value: string
  ) => {
    if (!value) return;
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), value],
    }));
  };

  const handleRemoveArrayValue = (
    field: "color_options" | "size_options",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((v) => v !== value),
    }));
  };

  const handleVariantChange = (
    index: number,
    field: keyof VariantForm,
    value: string | number
  ) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };
  
  const handleOtherImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files).map((file) => ({ image: file }));

    if (otherImageFiles.length + selectedFiles.length > 5) {
      alert("Vous pouvez sélectionner au maximum 5 images.");
      return;
    }

    setOtherImageFiles((prev) => [...prev, ...selectedFiles]);
  };


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true); 
  try {
    const data = new FormData();
    data.append("category", formData.category || "");
    data.append("name", formData.name || "");
    data.append("slug", formData.slug || "");
    data.append("description", formData.description || "");
    if (mainImageFile) {
      data.append("main_image", mainImageFile);
    }
    otherImageFiles.forEach((obj) => {
      data.append("other_images", obj.image);
    });
    data.append("product_variant", JSON.stringify(variants));

    const response = await apiService.post('/product/create_product/', data);
    if (response.status === "created") {
      toast.success("Product created !");
    }
  } catch (error) {
    toast.error("Something went wrong, try again later");
  } finally {
    setIsLoading(false); 
  }
};


  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Create Product</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        <div>
        <label className="block font-medium mb-1">Category</label>
       <select
          name="category"
          value={formData.category || ""}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="">-- Select a category --</option>
          <option value="Jackets">Jackets</option>
          <option value="Accessories">Accessories</option>
          <option value="Jeans">Jeans</option>
          <option value="Sneakers">Sneakers</option>
          <option value="Hoodies">Hoodies</option>
          <option value="T-Shirts">T-Shirts</option>
        </select>
        </div>
        
        {/* Name */}
        <div>
        <label className="block font-medium mb-1">Name</label>
        <input
          type="text"
          name="name"
          placeholder="Product name"
          value={formData.name || ""}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        </div>

        {/* Slug */}
        <div>
        <label className="block font-medium mb-1">Slug</label>
        <input
          type="text"
          name="slug"
          placeholder="Slug (e.g. classic-white-tshirt)"
          value={formData.slug || ""}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        </div>

        {/* Description */}

        <div>
        <label className="block font-medium mb-1">Description</label>
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description || ""}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        </div>

        {/* Main Image Upload */}
        <div>
          <label className="block font-medium mb-1">Main Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setMainImageFile(e.target.files ? e.target.files[0] : null)
            }
          />
          {mainImageFile && (
            <p className="text-sm text-gray-500 mt-1">
              Selected: {mainImageFile.name}
            </p>
          )}
        </div>

        {/* Other Images Upload */}
        <div>
          <label className="block font-medium mb-1">Other Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleOtherImageUpload }
          />



          <div className="flex gap-2 mt-2 flex-wrap">
            {otherImageFiles.map((obj, i) => (
              <div key={i} className="relative">
                <img
                  src={URL.createObjectURL(obj.image)}
                  alt={`Other ${i}`}
                  className="w-20 h-20 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() =>
                    setOtherImageFiles((prev) =>
                      prev.filter((_, idx) => idx !== i)
                    )
                  }
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Colors */}
        <ArrayInput
          label="Available Colors"
          field="color_options"
          values={formData.color_options || []}
          onAdd={handleAddArrayValue}
          onRemove={handleRemoveArrayValue}
        />

        {/* Sizes */}
        <ArrayInput
          label="Available Sizes"
          field="size_options"
          values={formData.size_options || []}
          onAdd={handleAddArrayValue}
          onRemove={handleRemoveArrayValue}
        />

        {/* Variants */}
        {variants.length > 0 && (
          <div>
            <h2 className="text-xl font-medium mb-3">Variants</h2>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Color</th>
                  <th className="p-2 border">Size</th>
                  <th className="p-2 border">Stock</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Discounted Price</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((variant, i) => (
                  <tr key={i}>
                    <td className="border p-2">{variant.color}</td>
                    <td className="border p-2">{variant.size}</td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={variant.stock_quantity}
                        onChange={(e) =>
                          handleVariantChange(i, "stock_quantity", Number(e.target.value))
                        }
                        className="border p-1 w-20"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={variant.price}
                        onChange={(e) =>
                          handleVariantChange(i, "price", Number(e.target.value))
                        }
                        className="border p-1 w-24"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={variant.discounted_price}
                        onChange={(e) =>
                          handleVariantChange(i, "discounted_price", Number(e.target.value))
                        }
                        className="border p-1 w-24"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
        {isLoading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

const ArrayInput = ({
  label,
  field,
  values,
  onAdd,
  onRemove,
}: {
  label: string;
  field: "color_options" | "size_options";
  values: string[];
  onAdd: (field: "color_options" | "size_options", value: string) => void;
  onRemove: (field: "color_options" | "size_options", value: string) => void;
}) => {
  const [input, setInput] = useState("");

  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Add a value`}
          className="border p-2 rounded flex-1"
        />
        <button
          type="button"
          onClick={() => {
            onAdd(field, input);
            setInput("");
          }}
          className="bg-gray-200 px-3 rounded"
        >
          Add
        </button>
      </div>
      <ul className="flex gap-2 mt-2 flex-wrap">
        {values.map((val, i) => (
          <li
            key={i}
            className="px-3 py-1 bg-gray-100 rounded border text-sm flex items-center gap-2"
          >
            {val}
            <button
              type="button"
              onClick={() => onRemove(field, val)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreateProductPage;
