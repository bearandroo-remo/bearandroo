import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabsModule } from 'primeng/tabs';
import { HttpService } from '../../http.service';

interface HeaderLink {
  label: string;
  type: string;
  slug: string;
}

interface SocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
}

@Component({
  selector: 'app-settings',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    InputNumberModule,
    TabsModule,
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class SettingsComponent implements OnInit {
  saving = signal(false);
  activeTab: string | number = '0';

  form = {
    logo: '',
    favicon: '',
    colorPrimary: '#8B6914',
    colorSecondary: '#F5EFE6',
    colorAccent: '#C4956A',
    colorText: '#2C2C2C',
    colorBackground: '#FAFAF8',
    fontFamily: 'Inter',
    borderRadius: '8px',
    footerText: '',
    email: '',
    phone: '',
    address: '',
    siteTitle: '',
    siteDescription: '',
    shippingPolicy: '',
    returnPolicy: '',
    estimatedDelivery: '',
    freeShippingThreshold: 0,
    shippingCost: 0,
  };

  headerLinks: HeaderLink[] = [];
  socialLinks: SocialLinks = {};

  fontOptions = [
    { label: 'Inter', value: 'Inter' },
    { label: 'Playfair Display', value: 'Playfair Display' },
    { label: 'Lato', value: 'Lato' },
    { label: 'Poppins', value: 'Poppins' },
    { label: 'Montserrat', value: 'Montserrat' },
  ];

  linkTypeOptions = [
    { label: 'Kategori', value: 'category' },
    { label: 'Koleksiyon', value: 'collection' },
    { label: 'Marka', value: 'brand' },
    { label: 'Özel URL', value: 'custom' },
  ];

  constructor(private http: HttpService) {}

  async ngOnInit() {
    await this.load();
  }

  async load() {
    try {
      const settings = await this.http.get<any>('/tenant-settings');
      if (settings) {
        this.form = {
          logo: settings.logo ?? '',
          favicon: settings.favicon ?? '',
          colorPrimary: settings.colorPrimary ?? '#8B6914',
          colorSecondary: settings.colorSecondary ?? '#F5EFE6',
          colorAccent: settings.colorAccent ?? '#C4956A',
          colorText: settings.colorText ?? '#2C2C2C',
          colorBackground: settings.colorBackground ?? '#FAFAF8',
          fontFamily: settings.fontFamily ?? 'Inter',
          borderRadius: settings.borderRadius ?? '8px',
          footerText: settings.footerText ?? '',
          email: settings.email ?? '',
          phone: settings.phone ?? '',
          address: settings.address ?? '',
          siteTitle: settings.siteTitle ?? '',
          siteDescription: settings.siteDescription ?? '',
          shippingPolicy: settings.shippingPolicy ?? '',
          returnPolicy: settings.returnPolicy ?? '',
          estimatedDelivery: settings.estimatedDelivery ?? '',
          freeShippingThreshold: settings.freeShippingThreshold ?? 0,
          shippingCost: settings.shippingCost ?? 0,
        };
        this.headerLinks = settings.headerLinks ?? [];
        this.socialLinks = settings.socialLinks ?? {};
      }
    } catch {
      // Settings yok, default değerler kullanılır
    }
  }

  addHeaderLink() {
    this.headerLinks.push({ label: '', type: 'category', slug: '' });
  }

  removeHeaderLink(index: number) {
    this.headerLinks.splice(index, 1);
  }

  async save() {
    this.saving.set(true);
    await this.http.put('/tenant-settings', {
      ...this.form,
      headerLinks: this.headerLinks,
      socialLinks: this.socialLinks,
    });
    this.saving.set(false);
  }
}
