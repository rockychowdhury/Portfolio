#!/bin/bash
cd /home/rocky/Projects/portfolio/components/portfolio/Blogs

# 1. Update MasonryGrid to be more compact
sed -i 's/xl:columns-3/xl:columns-4/g' MasonryGrid.tsx
sed -i 's/gap-5/gap-4/g' MasonryGrid.tsx
sed -i 's/mb-5/mb-4/g' MasonryGrid.tsx
sed -i 's/p-1 md:p-4 rounded-\[3rem\]/p-1 md:p-3 rounded-3xl/g' MasonryGrid.tsx

cd cards

# 2. CardA_Hero (Make image wider/shorter, reduce text size and padding)
sed -i 's/aspect-video/aspect-[16\/7]/g' CardA_Hero.tsx
sed -i 's/aspect-\[16\/8\]/aspect-[21\/9]/g' CardA_Hero.tsx
sed -i 's/rounded-\[2.5rem\]/rounded-3xl/g' CardA_Hero.tsx
sed -i 's/p-5 md:p-6/p-4/g' CardA_Hero.tsx
sed -i 's/text-3xl md:text-4xl mb-6/text-xl font-bold mb-3/g' CardA_Hero.tsx
sed -i 's/text-xl md:text-2xl mb-4/text-lg font-bold mb-2/g' CardA_Hero.tsx
sed -i 's/mb-6 line-clamp-2/mb-4 line-clamp-2 text-xs/g' CardA_Hero.tsx

# 3. CardB_DarkQuote (Reduce padding, min-height, and text size)
sed -i 's/rounded-\[2.5rem\]/rounded-3xl/g' CardB_DarkQuote.tsx
sed -i 's/p-6 md:p-8/p-5/g' CardB_DarkQuote.tsx
sed -i 's/min-h-\[250px\]/min-h-[180px]/g' CardB_DarkQuote.tsx
sed -i 's/text-lg md:text-xl/text-base/g' CardB_DarkQuote.tsx

# 4. CardC_Platform (Reduce padding, text size)
sed -i 's/rounded-\[2.5rem\]/rounded-3xl/g' CardC_Platform.tsx
sed -i 's/p-5 md:p-6/p-4/g' CardC_Platform.tsx
sed -i 's/text-xl md:text-2xl/text-lg/g' CardC_Platform.tsx
sed -i 's/mb-6/mb-4/g' CardC_Platform.tsx
sed -i 's/line-clamp-2/line-clamp-2 text-xs/g' CardC_Platform.tsx

# 5. CardD_Minimal (Reduce padding, text size)
sed -i 's/rounded-\[2.5rem\]/rounded-3xl/g' CardD_Minimal.tsx
sed -i 's/p-5 md:p-6/p-4/g' CardD_Minimal.tsx
sed -i 's/text-xl md:text-2xl/text-lg/g' CardD_Minimal.tsx
sed -i 's/mb-6/mb-4/g' CardD_Minimal.tsx

# 6. CardF_Micro (Reduce padding)
sed -i 's/rounded-\[2.5rem\]/rounded-3xl/g' CardF_Micro.tsx
sed -i 's/p-5/p-4/g' CardF_Micro.tsx
sed -i 's/text-lg md:text-xl/text-base/g' CardF_Micro.tsx

# 7. CardG_Overlay (Reduce min-height, text size)
sed -i 's/rounded-\[2.5rem\]/rounded-3xl/g' CardG_Overlay.tsx
sed -i 's/p-6 md:p-8/p-5/g' CardG_Overlay.tsx
sed -i 's/min-h-\[320px\]/min-h-[240px]/g' CardG_Overlay.tsx
sed -i 's/text-2xl md:text-3xl/text-lg md:text-xl/g' CardG_Overlay.tsx

