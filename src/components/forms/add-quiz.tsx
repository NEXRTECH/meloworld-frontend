import React, { useState } from 'react';
import Input from '../ui/input/input';
import Button from '../ui/button/button';
import TextArea from '../ui/textarea/textarea';
import { useAdminStore } from '../stores/admin-store';
import { useAuthStore } from '../stores/auth-store';
import { useToast } from '../hooks/use-toast';
import { Norm } from '../types';

interface AddQuizFormProps {
  onClose: () => void;
  chapterId: string;
  courseId: string;
}

const AddQuizForm = ({ onClose, chapterId, courseId }: AddQuizFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [selectedNormId, setSelectedNormId] = useState<string | null>(null);
  const [normSearch, setNormSearch] = useState('');
  const [showNormDropdown, setShowNormDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { createQuiz } = useAdminStore();
  const norms = useAdminStore(s => s.norms)
  const { token } = useAuthStore();
  const { toast } = useToast();

  const filteredNorms = norms.filter(norm =>
    norm.scale_name.toLowerCase().includes(normSearch.toLowerCase()) ||
    norm.gender.toLowerCase().includes(normSearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
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
    try {
      await createQuiz(token, {
        chapter_id: chapterId,
        course_id: courseId,
        title,
        description,
        image,
        norm_id: selectedNormId,
      });
      toast({
        title: "Quiz created",
        description: "The quiz has been created",
        variant: "success",
      });
      setTitle("");
      setDescription("");
      setImage("");
      setSelectedNormId(null);
      onClose();
    } catch (err) {
      setMessage("Failed to create quiz.");
      toast({
        title: "Error",
        description: "Failed to create quiz",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-md mx-auto p-4 w-full h-full rounded-xl justify-start"
    >
      <Input
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextArea
        placeholder="Quiz Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        rows={4}
      />
      <Input
        placeholder="Image URL (optional)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      {/* Searchable Norm Dropdown */}
      <div className="relative">
        <Input
          placeholder="Search and select norm"
          value={
            selectedNormId
              ? `${norms.find(n => n.normId === selectedNormId)?.scale_name || ''} (${norms.find(n => n.normId === selectedNormId)?.gender || ''})`
              : normSearch
          }
          onChange={e => {
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
            {filteredNorms.map(norm => (
              <div
                key={norm._id}
                className="p-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => {
                  setSelectedNormId(norm.normId);
                  setNormSearch('');
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
              setNormSearch('');
              setShowNormDropdown(true);
            }}
          >
            ×
          </button>
        )}
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Quiz"}
      </Button>
      {message && <div className="text-center text-sm mt-2">{message}</div>}
      <div className="flex gap-2 mt-4">
        <Button type="button" size="md" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddQuizForm;
