<script setup>
import { lpContent } from './data/lpContent'

import Header from './components/Header.vue'
import HeroSection from './components/HeroSection.vue'
import MembersSection from './components/MembersSection.vue'
import WorkSection from './components/WorkSection.vue'
import GrowthSection from './components/GrowthSection.vue'
import SupportSection from './components/SupportSection.vue'
import CareerSection from './components/CareerSection.vue'
import InterviewSection from './components/InterviewSection.vue'
import FlowSection from './components/FlowSection.vue'
import FinalCta from './components/FinalCta.vue'
import Footer from './components/Footer.vue'
import SectionDivider from './components/common/SectionDivider.vue'
</script>

<template>
  <Header :content="lpContent.header" />
  <main>
    <HeroSection :content="lpContent.hero" />
    <!-- Hero→01：01の上余白の中央に線を置く -->
    <SectionDivider :offset="0.3" />
    <MembersSection :content="lpContent.members" />
    <SectionDivider />
    <WorkSection :content="lpContent.work" />
    <SectionDivider />
    <GrowthSection :content="lpContent.growth" />
    <SectionDivider />
    <SupportSection :content="lpContent.support" />
    <SectionDivider />
    <CareerSection :content="lpContent.career" />
    <SectionDivider />
    <InterviewSection :content="lpContent.interview" />
    <SectionDivider />
    <FlowSection :content="lpContent.flow" />
    <FinalCta :content="lpContent.finalCta" />
  </main>
  <Footer :content="lpContent.footer" />
</template>
