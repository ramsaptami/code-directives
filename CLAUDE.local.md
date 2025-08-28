\# Project Gist



We are building a modular ecosystem for a visual moodboarding app. 

The app lets users search/discover products, curate them into moodboards, extract colors, and export/share. 

It will integrate with design tools like Canva, Figma, and Adobe. 



Core principle: SDK-first architecture. Each feature is extracted into reusable SDKs that can be shared across multiple projects.



So far, we have:

\- Best Practices SDK → defines coding/repo standards.

\- Rubric SDK → scores features/hooks/commands (impact, complexity, reusability, strategic fit).



Upcoming SDKs:

\- Spec SDK → feature spec templates + validator.

\- Claude Helper SDK → guides Claude workflows (suggestions first, rubric scoring, spec enforcement).

\- Theme SDK → tokens, fonts, colors, theme provider.

\- Integration Adapters SDK → shared interfaces for Canva/Figma/Adobe.

\- Security/Performance SDK → CI scans, perf budgets.



The main app (`/apps/moodboard-web`) will import these SDKs and provide:

\- Search + product discovery

\- Drag/drop moodboard building

\- Brand tagging + annotations

\- Export/share (PNG, integrations)



Docs:

\- Every feature/spec requires a Markdown doc + Mermaid diagram in `/docs`.

\- Tech debt tracked in `/docs/tech-debt.md`.

\- Claude instructions live in `claude.md` per app/SDK.



Workflow:

\- Suggestions first → Scored by Rubric → Approved → Spec → Code → Tests/CI → Merge.



The natural order is:
1. Spec SDK → So every feature starts with a doc template (keeps Claude structured).

2. Claude Helper SDK → Automates using rubric-sdk + spec-sdk together, and ensures “suggestions before code.”

3. Theme SDK → App-specific but reusable (tokens, theming, color/fonts).

4. Integration Adapters SDK → Interfaces for Canva/Figma/Adobe plugins.

5. Security/Performance SDK → CI checks (will plug into repo standards).

every feature is built as a separate plugin that can be used on the project

## Feasibility Analysis Summary

**Project Viability: HIGHLY FEASIBLE**
- TAM: $52B visual design tools → $71B by 2033, $1T social commerce by 2028
- Revenue Potential: $15-25M ARR by Year 3 (conservative-moderate scenario)
- Two-sided marketplace: Brands get discovered, shoppers discover brands
- Key advantages: SDK-first architecture, 70% faster deployment, multiple revenue streams
- Critical mass: 5K brands + 100K users achievable
- Unit economics: $1,200-6,000 LTV per brand at 70% gross margins

**Monetization Strategy:**
- Brand side (70%): Premium listings $99-499/mo, performance marketing, 3-5% transaction fees
- Consumer side (20%): Pro features $9.99/mo, affiliate commissions
- SDK licensing (10%): Enterprise licenses, white-label solutions

**Go-to-Market:**
1. Phase 1: 5 core SDKs + 100 beta brands (Fashion/Home Decor focus)
2. Phase 2: Marketplace launch + major platform partnership (Canva/Figma)
3. Phase 3: AI features + enterprise tier + international expansion

**Success Indicators:**
- Pinterest model validation: $1.15B quarterly, 83% users purchase from discoveries
- Visual discovery: 30% higher CTR, 27% higher AOV
- Network effects at scale create defensive moat

## Updated Product Vision: Lookbook Creation Platform

**Core Concept:** Magazine-style lookbook creator (not moodboards) - think Polyvore but for 2025

**Key User Journeys:**
1. **Holiday Wardrobe Planning**: User inputs "pastel colored shirts and light bottoms with accessories" → AI pulls combinations from brand catalogs → Creates magazine-style lookbook
2. **Interior Design**: User has "brown leather couch, wants wood coffee tables in teak within budget" → AI curates home accessories lookbook with complementary products
3. **Social Publishing**: Users can post created lookbooks on social media and create them directly in Canva/Adobe

**Business Model Refinement:**
- **Tiered Subscriptions**: Lower plans = limited lookbooks/changes, higher plans = unlimited
- **Centralized Purchasing**: Buy all products from app with unified tracking
- **Brand Onboarding**: Integrate brand catalogs via API/CSV/PIM systems

**Brand Integration Requirements:**
- **Critical Fields**: Product name, price, color (for optimal discovery)
- **Integration Methods**: Internal API, CSV uploads, or standard formats
- **Data Normalization**: Handle different brand catalog formats

**AI Personalization:**
- **Learning System**: User likes, priorities, behavior → builds personality profile
- **Future Curation**: Past experience informs future recommendations
- **Discovery Toggle**: "Surprise me" mode to break out of preference patterns

**Sustainability Focus:**
- **Anti Fast-Fashion**: Integration of brand scoring system
- **Ethical Verification**: Sustainable fashion verification and rating
- **Conscious Commerce**: Promote brands with better practices

## Technical Research Findings

**Market Gap Analysis:**
- Polyvore shutdown (2018) left significant void
- Current alternatives lack professional publishing + AI styling
- Market opportunity: $2.23B → $60B AI fashion market by 2034

**Product Catalog Integration:**
- **Common Formats**: JSON/XML APIs, CSV/Excel, PIM systems
- **Required Fields**: name, description, image, brand, SKU, price, color, material, category
- **Brand Standards**: Schema.org markup, ETIM classification
- **Processing**: 99.8% accuracy color extraction, automated categorization

**Subscription Pricing Trends (2024):**
- 42.4% of SaaS companies updated pricing (avg 20% increase)
- Hybrid models: subscription tiers + usage-based elements
- 41% offer 30-day free trials with feature/capacity limits

**User Personalization:**
- 77% prefer personalized data-based experiences
- Amazon's recommendation engine = 35% of total sales
- AI-driven fashion shopping: $2.23B → $60B by 2034

**Sustainable Fashion Verification:**
- Fashion Transparency Index: 250 brands ranked on climate/energy
- Good On You: People, Planet, Animals scoring system
- 90% of S&P 500 firms report ESG performance

**Visual Layout Reference:** Magazine-style "Key Prices" grid layout with mixed product categories in professional presentation format


