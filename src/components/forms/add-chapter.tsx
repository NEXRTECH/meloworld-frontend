import React, { useState } from "react";
import Input from "../ui/input/input";
import Button from "../ui/button/button";
import TextArea from "../ui/textarea/textarea";
import { useAdminStore } from "../stores/admin-store";
import { useAuthStore } from "../stores/auth-store";
import { useToast } from "../hooks/use-toast";
import { Norm } from "../types";

const AddChapterForm = ({
  onClose,
  courseId,
  norms,
}: {
  onClose: () => void;
  courseId: string;
  norms: Norm[];
}) => {
  const [title, setTitle] = useState("");
  const [chapterOrder, setChapterOrder] = useState(0);
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [selectedNormId, setSelectedNormId] = useState<number | null>(null);
  const [normSearch, setNormSearch] = useState("");
  const [showNormDropdown, setShowNormDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { createChapter, getChaptersByCourse } = useAdminStore();
  const { token } = useAuthStore();
  const { toast } = useToast();

  const filteredNorms = norms.filter(
    (norm) =>
      (norm.scale_name || "")
        .toLowerCase()
        .includes(normSearch.toLowerCase()) ||
      (norm.gender || "").toLowerCase().includes(normSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNormId) {
      setMessage("Please select a norm.");
      return;
    }
    if (!token) {
      setMessage("You must be logged in.");
      return;
    }
    setLoading(true);
    setMessage(null);
    createChapter(token, {
      course_id: courseId,
      title,
      chapter_order: chapterOrder,
      image,
      description,
      norm_id: selectedNormId,
    })
      .then(() =>
        toast({
          title: "Chapter created",
          description: "The chapter has been created",
          variant: "success",
        })
      )
      .catch((err) =>
        toast({
          title: "Error",
          description: "Failed to create chapter",
          variant: "error",
        })
      )
      .finally(() => setLoading(false));
    setTitle("");
    setChapterOrder(0);
    setImage("");
    setDescription("");
    setSelectedNormId(null);
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-md mx-auto p-4 bg-white rounded-xl shadow"
    >
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-semibold"
        >
          Title
        </label>
        <Input
          id="title"
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Title"
        />
      </div>
      <div>
        <label
          htmlFor="chapter_order"
          className="block text-sm font-semibold"
        >
          Chapter Order
        </label>
        <Input
          id="chapter_order"
          type="number"
          name="chapter_order"
          value={chapterOrder}
          onChange={(e) => setChapterOrder(Number(e.target.value))}
          required
          placeholder="Chapter Order"
        />
      </div>
      <div>
        <label
          htmlFor="image"
          className="block text-sm font-semibold"
        >
          Image URL
        </label>
        <Input
          id="image"
          type="text"
          name="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Image URL (optional)"
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-semibold"
        >
          Description
        </label>
        <TextArea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full"
          placeholder="Description"
          rows={4}
        />
      </div>
      {/* Searchable Norm Dropdown */}
      <div className="relative">
        <label
          htmlFor="norm-search"
          className="block text-sm font-semibold"
        >
          Norm
        </label>
        <Input
          id="norm-search"
          placeholder="Search and select norm"
          value={
            selectedNormId
              ? `${
                  norms.find((n) => n.normId === selectedNormId)?.scale_name ||
                  ""
                } (${
                  norms.find((n) => n.normId === selectedNormId)?.gender || ""
                })`
              : normSearch
          }
          onChange={(e) => {
            setNormSearch(e.target.value);
            setShowNormDropdown(true);
            setSelectedNormId(null);
          }}
          onFocus={() => setShowNormDropdown(true)}
          readOnly={!!selectedNormId}
        />
        {showNormDropdown && !selectedNormId && (
          <div className="absolute z-10 w-full bg-white border rounded shadow max-h-48 overflow-y-auto">
            {filteredNorms.length === 0 && (
              <div className="p-2 text-gray-500">No norms found</div>
            )}
            {filteredNorms.map((norm) => (
              <div
                key={norm._id}
                className="p-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => {
                  setSelectedNormId(norm.normId);
                  setNormSearch("");
                  setShowNormDropdown(false);
                }}
              >
                {norm.scale_name} ({norm.gender})
              </div>
            ))}
          </div>
        )}
        {selectedNormId && (
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
            onClick={() => {
              setSelectedNormId(null);
              setNormSearch("");
              setShowNormDropdown(true);
            }}
          >
            ×
          </button>
        )}
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Chapter"}
      </Button>
      {message && <div className="text-center text-sm mt-2">{message}</div>}
      
    </form>
  );
};

export default AddChapterForm;
