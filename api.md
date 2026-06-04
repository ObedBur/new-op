8 results - 8 files

frontend\src\app\admin\client\page.tsx:
  4  import { useSearchParams, useRouter } from 'next/navigation';
  5: import api from '@/lib/api';
  6  import {

frontend\src\app\admin\dashboard\page.tsx:
  3  import React, { useEffect, useState } from 'react';
  4: import api from '@/lib/api';
  5  import Link from 'next/link';

frontend\src\app\admin\notification\page.tsx:
  4  import { useAdminGuard } from '@/lib/use-admin-guard';
  5: import api from '@/lib/api';
  6  import { 

frontend\src\components\auth\DevenirPrestataireForm.tsx:
   9  import { motion, AnimatePresence } from 'framer-motion';
  10: import api from '@/lib/api';
  11  import { useRouter } from 'next/navigation';

frontend\src\components\auth\LoginForm.tsx:
   9  import { loginSchema, LoginInput } from '@/lib/validations/auth';
  10: import api from '@/lib/api';
  11  import { useAuth } from '@/lib/auth-context';

frontend\src\components\auth\RegisterForm.tsx:
   9  import { motion } from 'framer-motion';
  10: import api from '@/lib/api';
  11  import { useRouter } from 'next/navigation';

frontend\src\components\auth\VerifyOtpForm.tsx:
  6  import { toast } from 'sonner';
  7: import api from '@/lib/api';
  8  import { useRouter, useSearchParams } from 'next/navigation';

frontend\src\features\notifications\services\preferences.service.ts:
  1: import api from '@/lib/api';
  2  
