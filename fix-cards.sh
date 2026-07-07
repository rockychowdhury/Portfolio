#!/bin/bash
cd /home/rocky/Projects/portfolio/components/portfolio/Blogs/cards

# CardA_Hero
sed -i 's/bg-white border border-border\/60/bg-background border border-border\/50/g' CardA_Hero.tsx
sed -i 's/dark:bg-zinc-800\/80//g' CardA_Hero.tsx
sed -i 's/text-muted-foreground\/60/text-muted-foreground/g' CardA_Hero.tsx
sed -i 's/text-muted-foreground\/40/text-muted-foreground/g' CardA_Hero.tsx
sed -i 's/text-muted-foreground\/30/text-muted-foreground/g' CardA_Hero.tsx
sed -i 's/text-muted-foreground\/20/text-muted-foreground/g' CardA_Hero.tsx
sed -i 's/text-\[9px\] font-black uppercase tracking-\[0.25em\]/text-[10px] font-bold uppercase tracking-wider/g' CardA_Hero.tsx

# CardB_DarkQuote
sed -i 's/text-\[9px\] font-black uppercase tracking-\[0.25em\]/text-[10px] font-bold uppercase tracking-wider/g' CardB_DarkQuote.tsx
sed -i 's/bg-foreground text-background/bg-secondary text-foreground/g' CardB_DarkQuote.tsx
sed -i 's/text-background\/40 hover:text-background/text-muted-foreground hover:text-foreground/g' CardB_DarkQuote.tsx
sed -i 's/bg-background\/20/bg-primary\/50/g' CardB_DarkQuote.tsx

# CardC_Platform
sed -i 's/bg-white border-border\/60/bg-background border-border\/50/g' CardC_Platform.tsx
sed -i 's/dark:bg-zinc-800\/80//g' CardC_Platform.tsx
sed -i 's/text-muted-foreground\/60/text-muted-foreground/g' CardC_Platform.tsx
sed -i 's/text-muted-foreground\/40/text-muted-foreground/g' CardC_Platform.tsx
sed -i 's/text-\[9px\] font-black uppercase tracking-\[0.25em\]/text-[10px] font-bold uppercase tracking-wider/g' CardC_Platform.tsx

# CardD_Minimal
sed -i 's/bg-zinc-50 border-border\/40/bg-secondary\/30 border-border\/50/g' CardD_Minimal.tsx
sed -i 's/dark:bg-zinc-900\/50//g' CardD_Minimal.tsx
sed -i 's/text-muted-foreground\/40/text-muted-foreground/g' CardD_Minimal.tsx
sed -i 's/text-\[9px\] font-black uppercase tracking-\[0.25em\]/text-[10px] font-bold uppercase tracking-wider/g' CardD_Minimal.tsx

# CardF_Micro
sed -i 's/bg-white border-border\/60/bg-background border-border\/50/g' CardF_Micro.tsx
sed -i 's/dark:bg-zinc-800\/80//g' CardF_Micro.tsx
sed -i 's/text-muted-foreground\/60/text-muted-foreground/g' CardF_Micro.tsx

# CardG_Overlay
sed -i 's/text-white\/60/text-zinc-300/g' CardG_Overlay.tsx
sed -i 's/text-white\/40/text-zinc-400/g' CardG_Overlay.tsx
sed -i 's/text-\[9px\] font-black uppercase tracking-\[0.25em\]/text-[10px] font-bold uppercase tracking-wider/g' CardG_Overlay.tsx

