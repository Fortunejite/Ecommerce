'use client';

import { useAppSelector } from '@/hooks/redux.hook';
import { errorHandler } from '@/lib/errorHandler';
import { Concentrations, FraganceFamily } from '@/lib/perfumeDetails';
import {
  Box,
  Stack,
  TextField,
  Typography,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Grid2,
  InputAdornment,
  Button,
  IconButton,
  styled,
  SelectChangeEvent,
} from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { app } from '@/firebase';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import SimpleSnackbar from '@/components/snackbar';
import Image from 'next/image';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { IProduct } from '@/models/Product.model';

interface ImagePreviewProps {
  src: string;
  onRemove?: () => void;
  alt?: string;
}
interface MainPicProps {
  setFile: (file: FileWithPath | null) => void;
  preview: string;
  setPreview: Dispatch<SetStateAction<string>>;
}
interface ThumbnailsProps {
  setFiles: Dispatch<SetStateAction<FileWithPath[]>>;
  previews: string[];
  setPreviews: Dispatch<SetStateAction<string[]>>;
}

// Styled image container with hover effect
const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '150px',
  height: '150px',
  cursor: 'pointer',
  borderRadius: theme.spacing(1),
  border: `1px dashed ${theme.palette.secondary.dark}`,
  overflow: 'hidden',
  transition: 'border-color 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

// Reusable image preview component with a remove button

const ImagePreview = ({
  src,
  onRemove,
  alt = 'Preview',
}: ImagePreviewProps) => {
  return (
    <ImageContainer>
      <Image src={src} fill alt={alt} objectFit='contain' />
      {onRemove && (
        <IconButton
          onClick={onRemove}
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
            p: 0.5,
          }}
        >
          <Close fontSize='small' />
        </IconButton>
      )}
    </ImageContainer>
  );
};

const MainPic = ({ setFile, preview, setPreview }: MainPicProps) => {
  const onDrop = (acceptedFiles: FileWithPath[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      console.warn('File is larger than 5MB');
      return;
    }
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    maxFiles: 1,
  });

  // Cleanup preview URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <Box {...getRootProps()}>
      <input {...getInputProps()} />
      {preview ? (
        <ImagePreview src={preview} alt='Main Pic' />
      ) : (
        <ImageContainer
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Add fontSize='large' />
          {isDragActive ? (
            <Typography variant='body1'>Drop image here</Typography>
          ) : (
            <>
              <Typography variant='body1'>Browse photos</Typography>
              <Typography variant='body1'>or drop here</Typography>
            </>
          )}
        </ImageContainer>
      )}
    </Box>
  );
};

const Thumbnails = ({ setFiles, previews, setPreviews }: ThumbnailsProps) => {
  const onDrop = (acceptedFiles: FileWithPath[]) => {
    // Filter files that are 5MB or less
    const validFiles = acceptedFiles.filter(
      (file) => file.size <= 5 * 1024 * 1024,
    );
    if (validFiles.length === 0) {
      console.warn('No files under 5MB');
      return;
    }
    const newFiles = validFiles.slice(0, 3);
    // Merge with previous files if less than 3 new files
    setFiles((prev) => {
      const merged = [...prev, ...newFiles];
      return merged.slice(0, 3);
    });
    setPreviews((prev) => {
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      const merged = [...prev, ...newPreviews];
      return merged.slice(0, 3);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    maxFiles: 3,
  });

  // Cleanup all preview URLs when previews change
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  return (
    <Stack spacing={2} direction='row' alignItems='center'>
      {previews.map((preview, index) => (
        <ImagePreview
          key={preview}
          src={preview}
          alt={`Thumbnail ${index + 1}`}
          onRemove={() => {
            // Remove file and preview from state
            setFiles((prev) => prev.filter((_, i) => i !== index));
            setPreviews((prev) => prev.filter((_, i) => i !== index));
          }}
        />
      ))}
      {previews.length < 3 && (
        <Box {...getRootProps()}>
          <input {...getInputProps()} />
          <ImageContainer
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Add fontSize='large' />
            {isDragActive ? (
              <Typography variant='body1'>Drop image here</Typography>
            ) : (
              <>
                <Typography variant='body1'>Browse photos</Typography>
                <Typography variant='body1'>or drop here</Typography>
              </>
            )}
          </ImageContainer>
        </Box>
      )}
    </Stack>
  );
};

const NewProduct = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [product, setProduct] = useState<IProduct | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    concentration: '',
    fragranceFamily: '',
    gender: '',
    stock: 1,
    size: '',
    price: '',
    discount: '',
    description: '',
  });
  const [mainPic, setMainPic] = useState<FileWithPath | null>(null);
  const [thumbnails, setThumbnails] = useState<FileWithPath[]>([]);
  const [mainPicPreview, setMainPicPreview] = useState<string>('');
  const [thumbnailsPreviews, setThumbnailsPreviews] = useState<string[]>([]);

  const { brands } = useAppSelector((state) => state.brand);
  const router = useRouter();
  const storage = getStorage(app);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        const prod = res.data;
        setProduct(prod);
        setFormData({ ...prod, brand: prod.brand._id });
        setMainPicPreview(prod.mainPic);
        setThumbnailsPreviews(prod.otherImages);
      } catch (e) {
        console.error(errorHandler(e));
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    },
    [],
  );

  const handleSelect = useCallback(
    (e: SelectChangeEvent) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    },
    [],
  );

  const uploadMainPic = async (file: FileWithPath) => {
    const storageRef = ref(
      storage,
      `collections/perfume/mainPic/${Date.now()}-${file.name}`,
    );
    const uploadTask = await uploadBytesResumable(storageRef, file);
    return await getDownloadURL(uploadTask.ref);
  };

  const uploadThumbnails = async (files: FileWithPath[]) => {
    if (files.length > 3) return [];
    const downloadURLs: string[] = [];
    for (const file of files) {
      const storageRef = ref(
        storage,
        `collections/perfume/thumbnails/${Date.now()}-${file.name}`,
      );
      const uploadTask = await uploadBytesResumable(storageRef, file);
      downloadURLs.push(await getDownloadURL(uploadTask.ref));
    }
    return downloadURLs;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const mainPicURL = mainPic ? await uploadMainPic(mainPic) : null;
      const thumbnailsURLs = thumbnails
        ? await uploadThumbnails(thumbnails)
        : thumbnailsPreviews;

      thumbnailsPreviews.forEach((preview) => {
        if (product?.otherImages.includes(preview)) {
          thumbnailsURLs.push(preview);
        } else {
          const storageRef = ref(storage, preview);
          deleteObject(storageRef);
        }
      });

      const res = await axios.patch(`/api/admin/products/${product?._id}`, {
        ...formData,
        ...(mainPicURL && { mainPic: mainPicURL }),
        otherImages: thumbnailsURLs,
      });
      setMessage('Changes saved');
      setSnackbarOpen(true);
      console.log(res.data);
    } catch (error) {
      const errorMessage = errorHandler(error);
      setMessage(errorMessage);
      console.error(errorMessage);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    if (!product) return;
    try {
      await axios.delete(`/api/admin/products/${product?._id}`);
      product.otherImages.forEach((preview) => {
        const storageRef = ref(storage, preview);
        deleteObject(storageRef);
      });
      setMessage(`${product?.name} deleted`);
      setSnackbarOpen(true);
      router.push('/admin/products');
    } catch (error) {
      const errorMessage = errorHandler(error);
      setMessage(errorMessage);
      console.error(errorMessage);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  if(!product) return null

  return (
    <Stack p={{ xs: 1, sm: 4 }} spacing={2}>
      <Typography variant='h6'>Modify Perfume</Typography>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 3 }} spacing={1}>
          <Typography variant='subtitle1'>Main Picture</Typography>
          <MainPic
            setFile={setMainPic}
            preview={mainPicPreview}
            setPreview={setMainPicPreview}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 9 }} spacing={1}>
          <Typography variant='subtitle1'>Thumbnails</Typography>
          <Thumbnails
            setFiles={setThumbnails}
            previews={thumbnailsPreviews}
            setPreviews={setThumbnailsPreviews}
          />
        </Grid2>
      </Grid2>
      <Grid2 container component='form' spacing={2} onSubmit={handleSubmit}>
        <Grid2 size={{ xs: 12 }}>
          <TextField
            required
            label='Perfume Name'
            variant='standard'
            name='name'
            value={formData.name}
            error={!!formErrors.name}
            helperText={formErrors.name}
            onChange={handleChange}
            fullWidth
          />
        </Grid2>
        <Grid2 size={12}>
          <FormControl fullWidth required>
            <InputLabel>Brand</InputLabel>
            <Select value={formData.brand} name='brand' onChange={handleSelect}>
              <MenuItem value=''>Select Brand</MenuItem>
              {brands.map((brand) => (
                <MenuItem
                  key={brand._id.toString()}
                  value={brand._id.toString()}
                >
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth required>
            <InputLabel>Concentration</InputLabel>
            <Select
              value={formData.concentration}
              name='concentration'
              onChange={handleSelect}
            >
              <MenuItem value=''>Select Concentration</MenuItem>
              {Concentrations.map((concentration) => (
                <MenuItem key={concentration} value={concentration}>
                  {concentration}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 size={{ xs: 6, sm: 4 }}>
          <FormControl fullWidth required>
            <InputLabel>Fragrance Family</InputLabel>
            <Select
              value={formData.fragranceFamily}
              name='fragranceFamily'
              onChange={handleSelect}
            >
              <MenuItem value=''>Select Fragrance Family</MenuItem>
              {FraganceFamily.map((fragrance) => (
                <MenuItem key={fragrance} value={fragrance}>
                  {fragrance}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 size={{ xs: 6, sm: 4 }}>
          <FormControl fullWidth required>
            <InputLabel>Gender</InputLabel>
            <Select
              value={formData.gender}
              name='gender'
              onChange={handleSelect}
            >
              <MenuItem value=''>Select Gender</MenuItem>
              {['Men', 'Women', 'Unisex'].map((gender) => (
                <MenuItem key={gender} value={gender}>
                  {gender}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 3 }}>
          <TextField
            required
            label='Size'
            name='size'
            type='number'
            value={formData.size}
            error={!!formErrors.size}
            helperText={formErrors.size}
            onChange={handleChange}
            fullWidth
            InputProps={{
              endAdornment: <InputAdornment position='end'>ML</InputAdornment>,
            }}
            inputProps={{ min: 0 }}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 3 }}>
          <TextField
            required
            label='Stock'
            name='stock'
            type='number'
            value={formData.stock}
            error={!!formErrors.stock}
            helperText={formErrors.stock}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 1 }}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 3 }}>
          <TextField
            required
            label='Price'
            name='price'
            type='number'
            value={formData.price}
            error={!!formErrors.price}
            helperText={formErrors.price}
            onChange={handleChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>₦</InputAdornment>
              ),
            }}
            inputProps={{ min: 0 }}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 3 }}>
          <TextField
            label='Discount'
            name='discount'
            type='number'
            value={formData.discount}
            error={!!formErrors.discount}
            helperText={formErrors.discount}
            onChange={handleChange}
            fullWidth
            InputProps={{
              endAdornment: <InputAdornment position='end'>%</InputAdornment>,
            }}
            inputProps={{ min: 0, max: 100 }}
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <TextField
            required
            label='Perfume Description'
            name='description'
            value={formData.description}
            error={!!formErrors.description}
            helperText={formErrors.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={6}
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }} display='flex' justifyContent='center'>
          <Button
            sx={{ flex: 1 }}
            size='large'
            disabled={loading}
            onClick={() => handleDelete()}
          >
            Delete Perfume
          </Button>
          <Button
            type='submit'
            variant='contained'
            size='large'
            disabled={loading}
            sx={{ flex: 1 }}
          >
            Save Changes
          </Button>
        </Grid2>
      </Grid2>
      <SimpleSnackbar
        open={snackbarOpen}
        setOpen={setSnackbarOpen}
        message={message}
      />
    </Stack>
  );
};

export default NewProduct;
