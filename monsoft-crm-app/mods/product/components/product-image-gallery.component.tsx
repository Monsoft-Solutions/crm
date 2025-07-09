import { ReactElement, useState } from 'react';

import { toast } from 'sonner';

import { Upload, MoreVertical, Star, Trash2, ExternalLink } from 'lucide-react';

import { Button } from '@ui/button.ui';
import { Input } from '@ui/input.ui';
import { Label } from '@ui/label.ui';

import { Card, CardContent, CardHeader, CardTitle } from '@ui/card.ui';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@ui/dialog.ui';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@ui/dropdown-menu.ui';

import { api, apiClientUtils } from '@api/providers/web';

type ProductImage = {
    id: string;
    imageUrl: string;
    isMain: boolean;
};

type ProductImageGalleryProps = {
    productId: string;
    images: ProductImage[];
};

// component for displaying and managing product images
export function ProductImageGallery({
    productId,
    images,
}: ProductImageGalleryProps): ReactElement {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const mainImage = images.find((img) => img.isMain);
    const otherImages = images.filter((img) => !img.isMain);

    const handleAddImage = async () => {
        const url = newImageUrl.trim();

        if (!url) return;

        const { error } = await api.product.addProductImage.mutate({
            productId,
            url,
        });

        if (error) {
            toast.error('Failed to add image. Please try again.');
            return;
        }

        setNewImageUrl('');
        setIsAddDialogOpen(false);

        // refetch the product images
        await apiClientUtils.product.getProduct.invalidate();
    };

    const handleSetMain = async (imageId: string) => {
        const { error } = await api.product.setMainProductImage.mutate({
            imageId,
        });

        if (error) {
            toast.error('Failed to set main image. Please try again.');
            return;
        }

        // refetch the product images
        await apiClientUtils.product.getProduct.invalidate();
    };

    const handleDelete = async (imageId: string) => {
        const { error } = await api.product.deleteProductImage.mutate({
            id: imageId,
        });

        if (error) {
            toast.error('Failed to delete image. Please try again.');
            return;
        }

        // refetch the product images
        await apiClientUtils.product.getProduct.invalidate();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Product Images</h3>

                <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                >
                    <DialogTrigger asChild>
                        <Button size="sm">
                            <Upload className="mr-2 h-4 w-4" />
                            Add Image
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Product Image</DialogTitle>
                            <DialogDescription>
                                Enter the URL of the image you want to add.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="imageUrl">Image URL</Label>
                                <Input
                                    id="imageUrl"
                                    placeholder="https://example.com/image.jpg"
                                    value={newImageUrl}
                                    onChange={(e) => {
                                        setNewImageUrl(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsAddDialogOpen(false);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    void handleAddImage();
                                }}
                                disabled={!newImageUrl.trim()}
                            >
                                Add Image
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Images Grid */}
            {images.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Upload className="text-muted-foreground mx-auto h-12 w-12" />
                        <p className="text-muted-foreground mt-4">
                            No images added yet.
                        </p>
                        <Button
                            onClick={() => {
                                setIsAddDialogOpen(true);
                            }}
                            className="mt-4"
                            variant="outline"
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Add First Image
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {/* Main Image */}
                    {mainImage && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Star className="h-5 w-5 text-yellow-500" />
                                    Main Image
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative">
                                    <img
                                        src={mainImage.imageUrl}
                                        alt="Main product image"
                                        className="h-64 w-full cursor-pointer rounded-lg object-cover"
                                        onClick={() => {
                                            setSelectedImage(
                                                mainImage.imageUrl,
                                            );
                                        }}
                                    />
                                    <div className="absolute top-2 right-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        window.open(
                                                            mainImage.imageUrl,
                                                            '_blank',
                                                        )
                                                    }
                                                >
                                                    <ExternalLink className="mr-2 h-4 w-4" />
                                                    Open in New Tab
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        void handleDelete(
                                                            mainImage.id,
                                                        );
                                                    }}
                                                    className="text-destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Other Images */}
                    {otherImages.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Additional Images</CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                    {otherImages.map((image) => (
                                        <div
                                            key={image.id}
                                            className="group relative"
                                        >
                                            <div className="relative h-32 w-full">
                                                <img
                                                    src={image.imageUrl}
                                                    alt="Product image"
                                                    className="absolute inset-0 h-32 w-full cursor-pointer rounded-lg object-cover"
                                                />
                                            </div>
                                            <div className="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                        >
                                                            <MoreVertical className="h-3 w-3" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                void handleSetMain(
                                                                    image.id,
                                                                );
                                                            }}
                                                        >
                                                            <Star className="mr-2 h-4 w-4" />
                                                            Set as Main
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                window.open(
                                                                    image.imageUrl,
                                                                    '_blank',
                                                                )
                                                            }
                                                        >
                                                            <ExternalLink className="mr-2 h-4 w-4" />
                                                            Open in New Tab
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                void handleDelete(
                                                                    image.id,
                                                                );
                                                            }}
                                                            className="text-destructive"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
            {/* Image Preview Dialog */}
            {selectedImage && (
                <Dialog
                    open={!!selectedImage}
                    onOpenChange={() => {
                        setSelectedImage(null);
                    }}
                >
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>Image Preview</DialogTitle>
                        </DialogHeader>
                        <div className="flex justify-center">
                            <img
                                src={selectedImage}
                                alt="Product image preview"
                                className="max-h-96 max-w-full object-contain"
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
