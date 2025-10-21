import React, { useState } from "react";
import Input from "../ui/input/input";
import TextArea from "../ui/textarea/textarea";
import Button from "../ui/button/button";
import { useAuthStore } from "../stores/auth-store";
import { Norm } from "../types";
import { useAdminStore } from "../stores/admin-store";
import Select from "../ui/select/select";

const AddCourseForm = ({
  norms,
  onClose,
}: {
  norms: Norm[];
  onClose: () => void;
}) => {
  const { token } = useAuthStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [courseType, setCourseType] = useState("students");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedNormId, setSelectedNormId] = useState<number | null>(null);
  const [normSearch, setNormSearch] = useState("");
  const [showNormDropdown, setShowNormDropdown] = useState(false);

  const { createCourse } = useAdminStore();

  const filteredNorms = norms.filter(
    (norm) =>
      (norm.scale_name || "")
        .toLowerCase()
        .includes(normSearch.toLowerCase()) ||
      (norm.gender || "").toLowerCase().includes(normSearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console the entire form state
    console.debug(title, description, image, selectedNormId);
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
    try {
      setMessage("Course created successfully!");
      setTitle("");
      setDescription("");
      setImage("");
      createCourse(token, {
        title,
        description,
        image,
        normId: selectedNormId,
        type: courseType,
      }).then(() => {
        // close parent dialog
        onClose();
      });
    } catch (err) {
      setMessage("Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  const courseTypeOptions = [
    { value: "students", label: "Students" },
    { value: "corporate", label: "Corporate" },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-md mt-20 lg:mt-10  mx-auto p-4 bg-white "
    >
      <h2 className="text-xl font-semibold text-center">Add New Course</h2>

      <div className="flex flex-col gap-1">
        <label htmlFor="course-title" className="text-sm font-semibold">
          Course Title
        </label>
        <Input
          id="course-title"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="course-description" className="text-sm font-semibold">
          Course Description
        </label>
        <TextArea
          id="course-description"
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="image-url" className="text-sm font-semibold">
          Image URL (optional)
        </label>
        <Input
          id="image-url"
          placeholder="Image URL (optional)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>
      {/* Searchable Norm Dropdown */}
      <div className="relative flex flex-col gap-1">
        <label htmlFor="norm-search" className="text-sm font-semibold">
          Search and select norm
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
          <div className="absolute z-10 w-full bg-white border rounded shadow max-h-48 overflow-y-auto mt-16">
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
      <div className="flex flex-col gap-1">
        <label htmlFor="course-type" className="text-sm font-semibold">
          Course Type
        </label>
        <Select
          items={courseTypeOptions}
          value={courseType}
          onValueChange={setCourseType}
          placeholder="Select course type"
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Course"}
      </Button>
      {message && <div className="text-center text-sm mt-2">{message}</div>}
    </form>
  );
};

export default AddCourseForm;
