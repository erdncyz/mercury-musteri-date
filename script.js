// Mercury Müşteri ve İşlem Takip Sistemi
class CustomerWorkManager {
    constructor() {
        this.customers = [];
        this.works = [];
        this.payments = [];
        this.currentSearch = '';
        this.currentFilter = 'all';
        this.currentSort = 'name';
        this.selectedCustomer = null;
        this.currentDeleteWorkId = null;
        this.currentEditWorkId = null;
        this.initializeEventListeners();
        this.setDefaultDate();
        this.initializeData();
    }

    // Veri yükleme ve başlatma
    async initializeData() {
        await this.loadData();
        this.updateDisplay();
    }

    // API'den tüm verileri yükle
    async loadData() {
        try {
            const response = await fetch('/api/data');
            if (response.ok) {
                const data = await response.json();
                this.customers = data.customers || [];
                this.works = data.works || [];
                this.payments = data.payments || [];
                console.log('Veriler API\'den yüklendi');
            } else {
                console.log('API\'den veri alınamadı, boş verilerle başlanıyor');
                this.customers = [];
                this.works = [];
                this.payments = [];
            }
        } catch (error) {
            console.log('API\'den veri yüklenirken hata:', error);
            this.customers = [];
            this.works = [];
            this.payments = [];
        }
    }

    // API'ye verileri gönder
    async updateData() {
        try {
            const data = {
                customers: this.customers,
                works: this.works,
                payments: this.payments
            };

            const response = await fetch('/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                console.log('Veriler API\'ye gönderildi');
            } else {
                console.error('API\'ye veri gönderilemedi');
            }
            
        } catch (error) {
            console.error('API\'ye veri gönderilirken hata:', error);
        }
    }



    // Bugünün tarihini varsayılan olarak ayarla
    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('workDate').value = today;
        document.getElementById('paymentDate').value = today;
    }

    // Event listener'ları başlat
    initializeEventListeners() {
        // Müşteri form submit eventi
        document.getElementById('customerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addCustomer();
        });

        // İşlem form submit eventi
        document.getElementById('workForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addWork();
        });

        // Ödeme form submit eventi
        document.getElementById('paymentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addPayment();
        });

        // Excel'e aktar butonu
        document.getElementById('exportExcel').addEventListener('click', () => {
            this.exportToExcel();
        });

        // Müşteri arama
        document.getElementById('searchCustomer').addEventListener('input', (e) => {
            this.currentSearch = e.target.value.trim();
            this.updateDisplay();
            this.updateCustomerDebtInfo();
        });

        // Arama temizle
        document.getElementById('clearSearch').addEventListener('click', () => {
            document.getElementById('searchCustomer').value = '';
            this.currentSearch = '';
            this.updateDisplay();
            this.hideCustomerDebtInfo();
        });

        // Filtre değişikliği
        document.getElementById('debtFilter').addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.updateDisplay();
        });

        // Sıralama değişikliği
        document.getElementById('sortBy').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.updateDisplay();
        });

        // Müşteri detaylarını görüntüle
        document.getElementById('viewCustomerDetails').addEventListener('click', () => {
            this.viewCustomerDetails();
        });

        // Müşteri sil
        document.getElementById('deleteCustomer').addEventListener('click', () => {
            this.deleteCustomer();
        });

        // Müşteri listesi Excel aktar
        document.getElementById('exportCustomersExcel').addEventListener('click', () => {
            this.exportCustomersToExcel();
        });

        // Borç raporu Excel aktar
        document.getElementById('exportDebtReport').addEventListener('click', () => {
            this.exportDebtReportToExcel();
        });

        // Modal event listener'ları
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('modalCloseBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // Modal dışına tıklayınca kapat
        document.getElementById('customerDetailsModal').addEventListener('click', (e) => {
            if (e.target.id === 'customerDetailsModal') {
                this.closeModal();
            }
        });

        // ESC tuşu ile modal kapat
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeDeleteModal();
                this.closeDeleteWorkModal();
                this.closeEditWorkModal();
            }
        });

        // Silme modal event listener'ları
        document.getElementById('closeDeleteModal').addEventListener('click', () => {
            this.closeDeleteModal();
        });

        document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
            this.closeDeleteModal();
        });

        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            this.confirmDeleteCustomer();
        });

        // Silme modal dışına tıklayınca kapat
        document.getElementById('deleteConfirmModal').addEventListener('click', (e) => {
            if (e.target.id === 'deleteConfirmModal') {
                this.closeDeleteModal();
            }
        });

        // İşlem silme modal event listener'ları
        document.getElementById('closeDeleteWorkModal').addEventListener('click', () => {
            this.closeDeleteWorkModal();
        });

        document.getElementById('cancelDeleteWorkBtn').addEventListener('click', () => {
            this.closeDeleteWorkModal();
        });

        document.getElementById('confirmDeleteWorkBtn').addEventListener('click', () => {
            this.confirmDeleteWork();
        });

        // İşlem silme modal dışına tıklayınca kapat
        document.getElementById('deleteWorkConfirmModal').addEventListener('click', (e) => {
            if (e.target.id === 'deleteWorkConfirmModal') {
                this.closeDeleteWorkModal();
            }
        });

        // İşlem düzenleme modal event listener'ları
        document.getElementById('closeEditWorkModal').addEventListener('click', () => {
            this.closeEditWorkModal();
        });

        document.getElementById('cancelEditWorkBtn').addEventListener('click', () => {
            this.closeEditWorkModal();
        });

        document.getElementById('saveEditWorkBtn').addEventListener('click', () => {
            this.saveEditWork();
        });

        // İşlem düzenleme modal dışına tıklayınca kapat
        document.getElementById('editWorkModal').addEventListener('click', (e) => {
            if (e.target.id === 'editWorkModal') {
                this.closeEditWorkModal();
            }
        });

        // İşlem düzenleme formunda toplam fiyat hesaplama
        document.getElementById('editWorkQuantity').addEventListener('input', () => {
            this.calculateEditTotalPrice();
        });

        document.getElementById('editWorkUnitPrice').addEventListener('input', () => {
            this.calculateEditTotalPrice();
        });

        // Tab sistemi event listener'ları
        this.initializeTabs();

        // Toplam fiyat hesaplama event listener'ları
        this.initializePriceCalculation();
    }

    // Toplam fiyat hesaplama sistemi
    initializePriceCalculation() {
        const quantityInput = document.getElementById('workQuantity');
        const unitPriceInput = document.getElementById('workUnitPrice');
        const totalPriceDisplay = document.getElementById('totalPriceDisplay');

        const calculateTotal = () => {
            const quantity = parseInt(quantityInput.value) || 0;
            const unitPrice = parseFloat(unitPriceInput.value) || 0;
            const total = quantity * unitPrice;
            
            totalPriceDisplay.textContent = `₺${total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;
        };

        quantityInput.addEventListener('input', calculateTotal);
        unitPriceInput.addEventListener('input', calculateTotal);
    }

    // Tab sistemi başlat
    initializeTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = button.getAttribute('data-tab');
                console.log('Tab clicked:', targetTab); // Debug için
                this.switchToTab(targetTab);
            });
        });
    }

    // Tab değiştir
    switchToTab(tabName) {
        console.log('Switching to tab:', tabName); // Debug için
        
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');

        console.log('Found tab buttons:', tabButtons.length); // Debug için
        console.log('Found tab panels:', tabPanels.length); // Debug için

        // Tüm tab butonlarından active class'ını kaldır
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        // Hedef tab butonuna active class'ını ekle
        const targetButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (targetButton) {
            targetButton.classList.add('active');
            console.log('Activated button for:', tabName); // Debug için
        } else {
            console.error('Button not found for tab:', tabName); // Debug için
        }
        
        // Tüm tab panellerini gizle
        tabPanels.forEach(panel => panel.classList.remove('active'));
        
        // Hedef tab panelini göster
        const targetPanel = document.getElementById(`${tabName}-tab`);
        if (targetPanel) {
            targetPanel.classList.add('active');
            console.log('Activated panel for:', tabName); // Debug için
        } else {
            console.error('Panel not found for tab:', tabName); // Debug için
        }
    }

    // Yeni müşteri ekle
    async addCustomer() {
        const customerName = document.getElementById('customerName').value.trim();
        const customerPhone = document.getElementById('customerPhone').value.trim();
        const customerAddress = document.getElementById('customerAddress').value.trim();

        // Validasyon
        if (!customerName) {
            this.showNotification('Müşteri adı zorunludur!', 'error');
            return;
        }

        // Müşteri zaten var mı kontrol et
        const existingCustomer = this.customers.find(customer => 
            customer.name.toLowerCase() === customerName.toLowerCase()
        );

        if (existingCustomer) {
            this.showNotification('Bu müşteri zaten kayıtlı!', 'warning');
            return;
        }

        try {
            // API'ye müşteri gönder
            const response = await fetch('/api/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: customerName,
                    phone: customerPhone,
                    address: customerAddress
                })
            });

            if (response.ok) {
                const newCustomer = await response.json();
                this.customers.push(newCustomer);
                this.updateCustomerDropdowns();
                this.updateDisplay();
                this.clearCustomerForm();
                
                // İşlem tab'ına geç
                this.switchToTab('work');
                
                this.showNotification('Müşteri başarıyla eklendi!', 'success');
            } else {
                this.showNotification('Müşteri eklenirken hata oluştu!', 'error');
            }
        } catch (error) {
            console.error('Müşteri ekleme hatası:', error);
            this.showNotification('Müşteri eklenirken hata oluştu!', 'error');
        }
    }

    // Yeni işlem ekle
    async addWork() {
        const selectedCustomerId = parseInt(document.getElementById('selectedCustomer').value);
        const workDate = document.getElementById('workDate').value;
        const materialType = document.getElementById('materialType').value;
        const paintType = document.getElementById('paintType').value;
        const workDescription = document.getElementById('workDescription').value.trim();
        const quantity = parseInt(document.getElementById('workQuantity').value);
        const unitPrice = parseFloat(document.getElementById('workUnitPrice').value);

        // Validasyon
        if (!selectedCustomerId || !workDate || !materialType || !paintType || !workDescription || isNaN(quantity) || quantity <= 0 || isNaN(unitPrice) || unitPrice <= 0) {
            this.showNotification('Lütfen tüm alanları doğru şekilde doldurun!', 'error');
            return;
        }

        // Müşteriyi bul
        const customer = this.customers.find(c => c.id === selectedCustomerId);
        if (!customer) {
            this.showNotification('Seçilen müşteri bulunamadı!', 'error');
            return;
        }

        // Toplam fiyatı hesapla
        const totalPrice = quantity * unitPrice;

        try {
            // API'ye işlem gönder
            const response = await fetch('/api/works', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerId: selectedCustomerId,
                    customerName: customer.name,
                    date: workDate,
                    materialType: materialType,
                    paintType: paintType,
                    description: workDescription,
                    quantity: quantity,
                    unitPrice: unitPrice,
                    price: totalPrice
                })
            });

            if (response.ok) {
                const newWork = await response.json();
                this.works.unshift(newWork); // En üste ekle
                this.updateDisplay();
                this.clearWorkForm();
                
                // İşlemler tab'ına geç
                this.switchToTab('list');
                
                this.showNotification('İşlem başarıyla eklendi!', 'success');
            } else {
                this.showNotification('İşlem eklenirken hata oluştu!', 'error');
            }
        } catch (error) {
            console.error('İşlem ekleme hatası:', error);
            this.showNotification('İşlem eklenirken hata oluştu!', 'error');
        }
    }

    // Yeni ödeme ekle
    async addPayment() {
        const selectedCustomerId = parseInt(document.getElementById('paymentCustomer').value);
        const paymentDate = document.getElementById('paymentDate').value;
        const paymentAmount = parseFloat(document.getElementById('paymentAmount').value);
        const paymentMethod = document.getElementById('paymentMethod').value;
        const paymentNote = document.getElementById('paymentNote').value.trim();

        // Validasyon
        if (!selectedCustomerId || !paymentDate || isNaN(paymentAmount) || paymentAmount <= 0 || !paymentMethod) {
            this.showNotification('Lütfen tüm alanları doğru şekilde doldurun!', 'error');
            return;
        }

        // Müşteriyi bul
        const customer = this.customers.find(c => c.id === selectedCustomerId);
        if (!customer) {
            this.showNotification('Seçilen müşteri bulunamadı!', 'error');
            return;
        }

        try {
            // API'ye ödeme gönder
            const response = await fetch('/api/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerId: selectedCustomerId,
                    customerName: customer.name,
                    date: paymentDate,
                    amount: paymentAmount,
                    method: paymentMethod,
                    note: paymentNote
                })
            });

            if (response.ok) {
                const newPayment = await response.json();
                this.payments.unshift(newPayment); // En üste ekle
                this.updateDisplay();
                this.updateCustomerDebtInfo();
                this.clearPaymentForm();
                
                // İşlemler tab'ına geç
                this.switchToTab('list');
                
                this.showNotification('Ödeme başarıyla eklendi!', 'success');
            } else {
                this.showNotification('Ödeme eklenirken hata oluştu!', 'error');
            }
        } catch (error) {
            console.error('Ödeme ekleme hatası:', error);
            this.showNotification('Ödeme eklenirken hata oluştu!', 'error');
        }
    }

    // Müşteri formunu temizle
    clearCustomerForm() {
        document.getElementById('customerForm').reset();
    }

    // İşlem formunu temizle
    clearWorkForm() {
        document.getElementById('workForm').reset();
        this.setDefaultDate();
    }

    // Ödeme formunu temizle
    clearPaymentForm() {
        document.getElementById('paymentForm').reset();
        this.setDefaultDate();
    }

    // İşlemi sil
    async deleteWork(id) {
        console.log('deleteWork çağrıldı, ID:', id);
        // Silinecek işlemi bul
        const work = this.works.find(w => w.id === id);
        if (!work) {
            this.showNotification('Silinecek işlem bulunamadı!', 'error');
            return;
        }

        // Modal içeriğini oluştur
        const modalContent = `
            <p><strong>Bu işlemi silmek istediğinizden emin misiniz?</strong></p>
            
            <div class="delete-warning">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Bu işlem geri alınamaz!</span>
            </div>

            <div class="delete-info">
                <h4>Silinecek İşlem:</h4>
                <div class="work-item">
                    <div class="work-date">${this.formatDate(work.date)}</div>
                    <div class="work-desc">${this.escapeHtml(work.description)}</div>
                    <div class="work-details">
                        Müşteri: ${this.escapeHtml(work.customerName)} | 
                        Malzeme: ${this.escapeHtml(work.materialType || 'Belirtilmemiş')} | 
                        Boya: ${this.escapeHtml(work.paintType || 'Belirtilmemiş')} | 
                        Adet: ${work.quantity || 1} | 
                        Fiyat: ₺${work.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </div>
                </div>
            </div>
        `;

        // Modal içeriğini yükle ve aç
        document.getElementById('deleteWorkModalBody').innerHTML = modalContent;
        this.currentDeleteWorkId = id; // Silinecek işlem ID'sini sakla
        this.openDeleteWorkModal();
    }

    // İşlem silme onayı
    async confirmDeleteWork() {
        if (!this.currentDeleteWorkId) {
            return;
        }

        const workId = this.currentDeleteWorkId;

        try {
            const response = await fetch(`/api/works/${workId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                this.works = this.works.filter(work => work.id !== workId);
                    this.updateDisplay();
                    this.updateCustomerDebtInfo(); // Müşteri borç bilgilerini güncelle
                
                // Modal'ı kapat
                this.closeDeleteWorkModal();
                this.currentDeleteWorkId = null;
                
                    this.showNotification('İşlem silindi!', 'info');
                } else {
                    this.showNotification('İşlem silinirken hata oluştu!', 'error');
                }
            } catch (error) {
                console.error('İşlem silme hatası:', error);
                this.showNotification('İşlem silinirken hata oluştu!', 'error');
            }
        }

    // Müşteri sil
    async deleteCustomer() {
        if (!this.selectedCustomer) {
            this.showNotification('Silinecek müşteri seçilmedi!', 'warning');
            return;
        }

        const customerName = this.selectedCustomer.name;
        const customerWorks = this.works.filter(work => work.customerId === this.selectedCustomer.id);
        const customerPayments = this.payments.filter(payment => payment.customerId === this.selectedCustomer.id);

        // Modal içeriğini oluştur
        let modalContent = `
            <p><strong>"${this.escapeHtml(customerName)}"</strong> müşterisini silmek istediğinizden emin misiniz?</p>
            
            <div class="delete-warning">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Bu işlem geri alınamaz!</span>
            </div>
        `;

        if (customerWorks.length > 0 || customerPayments.length > 0) {
            modalContent += `
                <div class="delete-info">
                    <h4>Bu müşteriye ait:</h4>
                    <ul>
                        <li>${customerWorks.length} işlem</li>
                        <li>${customerPayments.length} ödeme</li>
                    </ul>
                    <p><strong>Bu veriler de silinecektir!</strong></p>
                </div>
            `;
        }

        // Modal içeriğini yükle ve aç
        document.getElementById('deleteModalBody').innerHTML = modalContent;
        this.openDeleteModal();
    }

    // Müşteri silme onayı
    async confirmDeleteCustomer() {
        if (!this.selectedCustomer) {
            return;
        }

        const customerName = this.selectedCustomer.name;

            try {
            const response = await fetch(`/api/customers/${this.selectedCustomer.id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                // Müşteriyi ve ilgili verileri sil
                this.customers = this.customers.filter(c => c.id !== this.selectedCustomer.id);
                this.works = this.works.filter(w => w.customerId !== this.selectedCustomer.id);
                this.payments = this.payments.filter(p => p.customerId !== this.selectedCustomer.id);
                
                    this.updateCustomerDropdowns();
                    this.updateDisplay();
                    this.hideCustomerDebtInfo();
                this.selectedCustomer = null;
                
                // Modal'ı kapat
                this.closeDeleteModal();
                
                this.showNotification(`"${customerName}" müşterisi ve ilgili veriler silindi!`, 'info');
                } else {
                this.showNotification('Müşteri silinirken hata oluştu!', 'error');
                }
            } catch (error) {
            console.error('Müşteri silme hatası:', error);
            this.showNotification('Müşteri silinirken hata oluştu!', 'error');
        }
    }


    // Ekranı güncelle
    updateDisplay() {
        this.updateSummary();
        this.updateWorkList();
        this.updateCustomerList();
        this.updateCustomerDropdowns();
    }

    // Özet bilgileri güncelle
    updateSummary() {
        const totalCustomers = this.customers.length;
        const totalWorks = this.works.length;
        const totalAmount = this.works.reduce((sum, work) => sum + work.price, 0);
        const totalPaid = this.payments.reduce((sum, payment) => sum + payment.amount, 0);
        const totalDebt = totalAmount - totalPaid;

        document.getElementById('totalCustomers').textContent = totalCustomers;
        document.getElementById('totalWorks').textContent = totalWorks;
        document.getElementById('totalAmount').textContent = `₺${totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;
        document.getElementById('totalDebt').textContent = `₺${totalDebt.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;
        document.getElementById('totalPaid').textContent = `₺${totalPaid.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;
    }

    // Müşteri listesini güncelle
    updateCustomerList() {
        const customerList = document.getElementById('customerList');
        const customerListTitle = document.getElementById('customerListTitle');
        
        if (this.customers.length === 0) {
            customerList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-user-plus"></i>
                    <p>Henüz müşteri eklenmemiş</p>
                </div>
            `;
            customerListTitle.textContent = 'Kayıtlı Müşteriler';
            return;
        }

        // Müşterileri filtrele ve sırala
        let filteredCustomers = this.filterAndSortCustomers();
        
        // Liste başlığını güncelle
        if (this.currentSearch || this.currentFilter !== 'all') {
            customerListTitle.textContent = `${filteredCustomers.length} Müşteri (Filtrelenmiş)`;
        } else {
            customerListTitle.textContent = 'Kayıtlı Müşteriler';
        }

        if (filteredCustomers.length === 0) {
            customerList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <p>Filtre kriterlerine uygun müşteri bulunamadı</p>
                </div>
            `;
            return;
        }

        const customersHTML = filteredCustomers.map(customer => {
            // Bu müşteriye ait işlemleri say
            const customerWorks = this.works.filter(work => work.customerId === customer.id);
            const workCount = customerWorks.length;
            
            // Bu müşteriye ait toplam tutarı hesapla
            const totalAmount = customerWorks.reduce((sum, work) => sum + work.price, 0);
            
            // Bu müşteriye ait ödemeleri hesapla
            const customerPayments = this.payments.filter(payment => payment.customerId === customer.id);
            const totalPaid = customerPayments.reduce((sum, payment) => sum + payment.amount, 0);
            
            // Kalan borcu hesapla
            const remainingDebt = totalAmount - totalPaid;
            
            // Seçili müşteri kontrolü
            const isSelected = this.selectedCustomer && this.selectedCustomer.id === customer.id;
            
            return `
                <div class="customer-item ${isSelected ? 'selected' : ''}" data-customer-id="${customer.id}">
                    <div class="customer-info">
                        <h4>${this.escapeHtml(customer.name)}</h4>
                        <p>${customer.phone ? this.escapeHtml(customer.phone) : 'Telefon yok'}</p>
                        ${customer.address ? `<p>${this.escapeHtml(customer.address)}</p>` : ''}
                    </div>
                    <div class="customer-stats">
                        <div class="work-count">${workCount} işlem</div>
                        <div class="debt-amount">₺${remainingDebt.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</div>
                        <div class="paid-amount">₺${totalPaid.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ödenen</div>
                    </div>
                </div>
            `;
        }).join('');
        
        customerList.innerHTML = customersHTML;
        
        // Müşteri seçimi için event listener ekle
        this.addCustomerSelectionListeners();
    }

    // Müşterileri filtrele ve sırala
    filterAndSortCustomers() {
        let filtered = [...this.customers];

        // Arama filtresi
        if (this.currentSearch) {
            const searchLower = this.currentSearch.toLowerCase();
            filtered = filtered.filter(customer => 
                customer.name.toLowerCase().includes(searchLower) ||
                (customer.phone && customer.phone.toLowerCase().includes(searchLower)) ||
                (customer.address && customer.address.toLowerCase().includes(searchLower))
            );
        }

        // Borç filtresi
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(customer => {
                const customerWorks = this.works.filter(work => work.customerId === customer.id);
                const customerPayments = this.payments.filter(payment => payment.customerId === customer.id);
                const totalAmount = customerWorks.reduce((sum, work) => sum + work.price, 0);
                const totalPaid = customerPayments.reduce((sum, payment) => sum + payment.amount, 0);
                const remainingDebt = totalAmount - totalPaid;

                switch (this.currentFilter) {
                    case 'debt':
                        return remainingDebt > 0;
                    case 'no-debt':
                        return remainingDebt <= 0;
                    case 'overpaid':
                        return remainingDebt < 0;
                    default:
                        return true;
                }
            });
        }

        // Sıralama
        filtered.sort((a, b) => {
            const aWorks = this.works.filter(work => work.customerId === a.id);
            const bWorks = this.works.filter(work => work.customerId === b.id);
            const aPayments = this.payments.filter(payment => payment.customerId === a.id);
            const bPayments = this.payments.filter(payment => payment.customerId === b.id);
            
            const aTotalAmount = aWorks.reduce((sum, work) => sum + work.price, 0);
            const bTotalAmount = bWorks.reduce((sum, work) => sum + work.price, 0);
            const aTotalPaid = aPayments.reduce((sum, payment) => sum + payment.amount, 0);
            const bTotalPaid = bPayments.reduce((sum, payment) => sum + payment.amount, 0);
            const aRemainingDebt = aTotalAmount - aTotalPaid;
            const bRemainingDebt = bTotalAmount - bTotalPaid;

            switch (this.currentSort) {
                case 'name':
                    return a.name.localeCompare(b.name, 'tr');
                case 'debt':
                    return bRemainingDebt - aRemainingDebt;
                case 'works':
                    return bWorks.length - aWorks.length;
                case 'recent':
                    const aLastWork = aWorks.sort((x, y) => new Date(y.date) - new Date(x.date))[0];
                    const bLastWork = bWorks.sort((x, y) => new Date(y.date) - new Date(x.date))[0];
                    if (!aLastWork && !bLastWork) return 0;
                    if (!aLastWork) return 1;
                    if (!bLastWork) return -1;
                    return new Date(bLastWork.date) - new Date(aLastWork.date);
                default:
                    return 0;
            }
        });

        return filtered;
    }

    // Müşteri seçimi event listener'ları
    addCustomerSelectionListeners() {
        const customerItems = document.querySelectorAll('.customer-item');
        customerItems.forEach(item => {
            item.addEventListener('click', () => {
                const customerId = parseInt(item.dataset.customerId);
                this.selectCustomer(customerId);
            });
        });
    }

    // Müşteri seç
    selectCustomer(customerId) {
        this.selectedCustomer = this.customers.find(c => c.id === customerId);
        this.updateDisplay();
        this.updateCustomerDebtInfo();
    }

    // Müşteri dropdown'larını güncelle
    updateCustomerDropdowns() {
        // İşlem formu için dropdown
        const workSelect = document.getElementById('selectedCustomer');
        workSelect.innerHTML = '<option value="">Müşteri seçin...</option>';
        
        // Ödeme formu için dropdown
        const paymentSelect = document.getElementById('paymentCustomer');
        paymentSelect.innerHTML = '<option value="">Müşteri seçin...</option>';

        // İşlem düzenleme formu için dropdown
        const editSelect = document.getElementById('editSelectedCustomer');
        editSelect.innerHTML = '<option value="">Müşteri seçin</option>';
        
        this.customers.forEach(customer => {
            // İşlem formu için
            const workOption = document.createElement('option');
            workOption.value = customer.id;
            workOption.textContent = customer.name;
            workSelect.appendChild(workOption);

            // Ödeme formu için
            const paymentOption = document.createElement('option');
            paymentOption.value = customer.id;
            paymentOption.textContent = customer.name;
            paymentSelect.appendChild(paymentOption);

            // İşlem düzenleme formu için
            const editOption = document.createElement('option');
            editOption.value = customer.id;
            editOption.textContent = customer.name;
            editSelect.appendChild(editOption);
        });
    }

    // İşlem listesini güncelle
    updateWorkList() {
        const workList = document.getElementById('workList');
        const listTitle = document.getElementById('listTitle');
        
        // Filtrelenmiş işlemleri al
        let filteredWorks = this.works;
        
        if (this.currentSearch) {
            filteredWorks = this.works.filter(work => 
                work.customerName.toLowerCase().includes(this.currentSearch.toLowerCase()) ||
                work.description.toLowerCase().includes(this.currentSearch.toLowerCase())
            );
        }

        // Liste başlığını güncelle
        if (this.currentSearch) {
            listTitle.textContent = `"${this.currentSearch}" için ${filteredWorks.length} işlem`;
        } else {
            listTitle.textContent = 'Tüm İşlemler';
        }

        if (filteredWorks.length === 0) {
            if (this.currentSearch) {
                workList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <p>"${this.currentSearch}" için işlem bulunamadı</p>
                    </div>
                `;
            } else {
                workList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <p>Henüz işlem eklenmemiş</p>
                    </div>
                `;
            }
            return;
        }

        const worksHTML = filteredWorks.map(work => this.createWorkCard(work)).join('');
        workList.innerHTML = worksHTML;

        // Silme butonları için event listener ekle
        this.addDeleteEventListeners();
    }

    // Müşteri borç bilgilerini güncelle
    updateCustomerDebtInfo() {
        const debtInfo = document.getElementById('customerDebtInfo');
        
        // Seçili müşteri varsa onu göster
        if (this.selectedCustomer) {
            this.showCustomerDebtInfo(this.selectedCustomer);
            return;
        }

        // Arama kriterine uyan müşteriyi bul
        if (this.currentSearch && this.currentSearch.length >= 2) {
        const customer = this.customers.find(c => 
            c.name.toLowerCase().includes(this.currentSearch.toLowerCase())
        );

            if (customer) {
                this.showCustomerDebtInfo(customer);
            return;
            }
        }

        this.hideCustomerDebtInfo();
    }

    // Müşteri borç bilgilerini göster
    showCustomerDebtInfo(customer) {
        const debtInfo = document.getElementById('customerDebtInfo');

        // Müşterinin işlemlerini ve ödemelerini hesapla
        const customerWorks = this.works.filter(work => work.customerId === customer.id);
        const customerPayments = this.payments.filter(payment => payment.customerId === customer.id);
        
        const totalDebt = customerWorks.reduce((sum, work) => sum + work.price, 0);
        const totalPaid = customerPayments.reduce((sum, payment) => sum + payment.amount, 0);
        const remainingDebt = totalDebt - totalPaid;

        // Borç bilgilerini göster
        document.getElementById('selectedCustomerName').textContent = customer.name;
        document.getElementById('customerTotalDebt').textContent = `₺${totalDebt.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;
        document.getElementById('customerTotalPaid').textContent = `₺${totalPaid.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;
        document.getElementById('customerRemainingDebt').textContent = `₺${remainingDebt.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;
        document.getElementById('customerWorkCount').textContent = customerWorks.length;

        // Kalan borç rengini ayarla
        const remainingDebtElement = document.getElementById('customerRemainingDebt');
        if (remainingDebt > 0) {
            remainingDebtElement.style.color = '#e74c3c'; // Kırmızı
        } else if (remainingDebt < 0) {
            remainingDebtElement.style.color = '#27ae60'; // Yeşil (fazla ödeme)
        } else {
            remainingDebtElement.style.color = '#27ae60'; // Yeşil (borç yok)
        }

        debtInfo.style.display = 'block';
    }

    // Müşteri borç bilgilerini gizle
    hideCustomerDebtInfo() {
        const debtInfo = document.getElementById('customerDebtInfo');
        debtInfo.style.display = 'none';
    }

    // İşlem kartı HTML'i oluştur
    createWorkCard(work) {
        const formattedDate = this.formatDate(work.date);
        const formattedPrice = work.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 });
        const quantity = work.quantity || 1;
        const unitPrice = work.unitPrice || work.price;
        const formattedUnitPrice = unitPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 });
        const materialType = work.materialType || 'Belirtilmemiş';
        const paintType = work.paintType || 'Belirtilmemiş';
        
        return `
            <div class="work-card" data-id="${work.id}">
                <div class="work-header">
                    <div class="customer-name">${this.escapeHtml(work.customerName)}</div>
                    <div class="work-date">${formattedDate}</div>
                </div>
                <div class="work-description">${this.escapeHtml(work.description)}</div>
                <div class="work-details">
                    <div class="work-material">
                        <i class="fas fa-cube"></i>
                        <span>Malzeme: ${this.escapeHtml(materialType)}</span>
                    </div>
                    <div class="work-paint">
                        <i class="fas fa-paint-brush"></i>
                        <span>Boya: ${this.escapeHtml(paintType)}</span>
                    </div>
                    <div class="work-quantity">Adet: ${quantity}</div>
                    <div class="work-unit-price">Birim Fiyat: ₺${formattedUnitPrice}</div>
                </div>
                <div class="work-price">Toplam: ₺${formattedPrice}</div>
                <div class="work-actions">
                    <button class="edit-btn" onclick="customerWorkManager.editWork(${work.id})">
                        <i class="fas fa-edit"></i> Düzenle
                    </button>
                    <button class="delete-btn" onclick="customerWorkManager.deleteWork(${work.id})">
                        <i class="fas fa-trash"></i> Sil
                    </button>
                </div>
            </div>
        `;
    }

    // Silme ve düzenleme butonları için event listener ekle
    addDeleteEventListeners() {
        // Event delegation kullanarak dinamik olarak eklenen butonları yakala
        document.getElementById('workList').addEventListener('click', (e) => {
            if (e.target.closest('.delete-btn')) {
                const workCard = e.target.closest('.work-card');
                const workId = parseInt(workCard.dataset.id);
                this.deleteWork(workId);
            } else if (e.target.closest('.edit-btn')) {
                const workCard = e.target.closest('.work-card');
                const workId = parseInt(workCard.dataset.id);
                this.editWork(workId);
            }
        });
    }

    // Tarihi formatla
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // HTML escape fonksiyonu (güvenlik için)
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Excel'e dışa aktar
    exportToExcel() {
        if (this.works.length === 0) {
            this.showNotification('Dışa aktarılacak işlem bulunmuyor!', 'warning');
            return;
        }

        try {
            // CSV formatında veri hazırla
            const csvContent = this.generateCSV();
            
            // Dosya adı oluştur
            const now = new Date();
            const dateStr = now.toISOString().split('T')[0];
            const fileName = `Mercury_Islemler_${dateStr}.csv`;
            
            // Dosyayı indir
            this.downloadFile(csvContent, fileName, 'text/csv;charset=utf-8;');
            
            this.showNotification('İşlem verileri Excel formatında indirildi!', 'success');
        } catch (error) {
            console.error('Excel dışa aktarma hatası:', error);
            this.showNotification('Dışa aktarma sırasında bir hata oluştu!', 'error');
        }
    }

    // CSV içeriği oluştur
    generateCSV() {
        // Türkçe karakterler için BOM ekle
        let csvContent = '\uFEFF';
        
        // Başlık satırı
        csvContent += 'Müşteri Adı,Tarih,Malzeme Türü,Boya Türü,Yapılan İş,Adet,Birim Fiyat,Toplam Fiyat (₺),Eklenme Tarihi\n';
        
        // İşlem verileri
        this.works.forEach(work => {
            const customerName = this.escapeCSV(work.customerName);
            const date = this.formatDateForCSV(work.date);
            const materialType = this.escapeCSV(work.materialType || 'Belirtilmemiş');
            const paintType = this.escapeCSV(work.paintType || 'Belirtilmemiş');
            const description = this.escapeCSV(work.description);
            const quantity = work.quantity || 1;
            const unitPrice = (work.unitPrice || work.price).toFixed(2).replace('.', ',');
            const price = work.price.toFixed(2).replace('.', ',');
            const createdDate = this.formatDateForCSV(work.createdAt);
            
            csvContent += `${customerName},${date},${materialType},${paintType},${description},${quantity},${unitPrice},${price},${createdDate}\n`;
        });
        
        // Özet bilgileri ekle
        const stats = this.getStatistics();
        csvContent += '\n';
        csvContent += 'ÖZET BİLGİLER\n';
        csvContent += `Toplam Müşteri Sayısı,${stats.totalCustomers}\n`;
        csvContent += `Toplam İşlem Sayısı,${stats.totalWorks}\n`;
        csvContent += `Toplam Tutar,${stats.totalAmount.toFixed(2).replace('.', ',')} ₺\n`;
        csvContent += `Toplam Ödenen,${stats.totalPaid.toFixed(2).replace('.', ',')} ₺\n`;
        csvContent += `Toplam Borç,${stats.totalDebt.toFixed(2).replace('.', ',')} ₺\n`;
        csvContent += `Ortalama İşlem Tutarı,${stats.averageWorkAmount.toFixed(2).replace('.', ',')} ₺\n`;
        csvContent += `Bu Ay İşlem Sayısı,${stats.thisMonthWorks}\n`;
        csvContent += `Bu Ay Toplam Tutar,${stats.thisMonthAmount.toFixed(2).replace('.', ',')} ₺\n`;
        
        return csvContent;
    }

    // CSV için metin kaçırma
    escapeCSV(text) {
        if (text.includes(',') || text.includes('"') || text.includes('\n')) {
            return `"${text.replace(/"/g, '""')}"`;
        }
        return text;
    }

    // CSV için tarih formatı
    formatDateForCSV(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR');
    }

    // Dosya indirme fonksiyonu
    downloadFile(content, fileName, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            // Modern tarayıcılar için
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else {
            // Eski tarayıcılar için
            window.open('data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(content));
        }
    }

    // İstatistikler
    getStatistics() {
        const totalCustomers = this.customers.length;
        const totalWorks = this.works.length;
        const totalAmount = this.works.reduce((sum, work) => sum + work.price, 0);
        const totalPaid = this.payments.reduce((sum, payment) => sum + payment.amount, 0);
        const totalDebt = totalAmount - totalPaid;
        const averageWorkAmount = totalWorks > 0 ? totalAmount / totalWorks : 0;
        
        // Bu ayın işlemleri
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const thisMonthWorks = this.works.filter(work => {
            const workDate = new Date(work.date);
            return workDate.getMonth() === currentMonth && workDate.getFullYear() === currentYear;
        });
        
        return {
            totalCustomers,
            totalWorks,
            totalAmount,
            totalPaid,
            totalDebt,
            averageWorkAmount,
            thisMonthWorks: thisMonthWorks.length,
            thisMonthAmount: thisMonthWorks.reduce((sum, work) => sum + work.price, 0)
        };
    }

    // Bildirim göster
    showNotification(message, type = 'info') {
        // Mevcut bildirimi kaldır
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Yeni bildirim oluştur
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        // Bildirim stilleri
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            animation: slideIn 0.3s ease;
        `;

        // CSS animasyonu ekle
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // 3 saniye sonra bildirimi kaldır
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    // Bildirim ikonu al
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle',
            warning: 'exclamation-triangle'
        };
        return icons[type] || 'info-circle';
    }

    // Bildirim rengi al
    getNotificationColor(type) {
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            info: '#3498db',
            warning: '#f39c12'
        };
        return colors[type] || '#3498db';
    }





    // Müşteri listesini Excel'e aktar
    exportCustomersToExcel() {
        if (this.customers.length === 0) {
            this.showNotification('Dışa aktarılacak müşteri bulunmuyor!', 'warning');
            return;
        }

        try {
            const now = new Date();
            const dateStr = now.toISOString().split('T')[0];
            const fileName = `Mercury_Musteriler_${dateStr}.csv`;
            
            let csvContent = '\uFEFF'; // BOM for Turkish characters
            csvContent += 'Müşteri Adı,Telefon,Adres,Kayıt Tarihi,İşlem Sayısı,Toplam Borç,Ödenen,Kalan Borç\n';
            
            this.customers.forEach(customer => {
                const customerWorks = this.works.filter(work => work.customerId === customer.id);
                const customerPayments = this.payments.filter(payment => payment.customerId === customer.id);
                const totalAmount = customerWorks.reduce((sum, work) => sum + work.price, 0);
                const totalPaid = customerPayments.reduce((sum, payment) => sum + payment.amount, 0);
                const remainingDebt = totalAmount - totalPaid;
                
                csvContent += `${this.escapeCSV(customer.name)},${this.escapeCSV(customer.phone || '')},${this.escapeCSV(customer.address || '')},${this.formatDateForCSV(customer.createdAt)},${customerWorks.length},${totalAmount.toFixed(2).replace('.', ',')},${totalPaid.toFixed(2).replace('.', ',')},${remainingDebt.toFixed(2).replace('.', ',')}\n`;
            });
            
            this.downloadFile(csvContent, fileName, 'text/csv;charset=utf-8;');
            this.showNotification('Müşteri listesi Excel formatında indirildi!', 'success');
        } catch (error) {
            console.error('Müşteri listesi dışa aktarma hatası:', error);
            this.showNotification('Dışa aktarma sırasında bir hata oluştu!', 'error');
        }
    }

    // Borç raporunu Excel'e aktar
    exportDebtReportToExcel() {
        if (this.customers.length === 0) {
            this.showNotification('Dışa aktarılacak müşteri bulunmuyor!', 'warning');
            return;
        }

        try {
            const now = new Date();
            const dateStr = now.toISOString().split('T')[0];
            const fileName = `Mercury_Borc_Raporu_${dateStr}.csv`;
            
            let csvContent = '\uFEFF'; // BOM for Turkish characters
            csvContent += 'Müşteri Adı,Telefon,Toplam Borç,Ödenen,Kalan Borç,İşlem Sayısı,Son İşlem Tarihi\n';
            
            // Müşterileri borca göre sırala
            const customersWithDebt = this.customers.map(customer => {
                const customerWorks = this.works.filter(work => work.customerId === customer.id);
                const customerPayments = this.payments.filter(payment => payment.customerId === customer.id);
                const totalAmount = customerWorks.reduce((sum, work) => sum + work.price, 0);
                const totalPaid = customerPayments.reduce((sum, payment) => sum + payment.amount, 0);
                const remainingDebt = totalAmount - totalPaid;
                const lastWorkDate = customerWorks.length > 0 ? 
                    customerWorks.sort((a, b) => new Date(b.date) - new Date(a.date))[0].date : '';
                
                return {
                    customer,
                    totalAmount,
                    totalPaid,
                    remainingDebt,
                    workCount: customerWorks.length,
                    lastWorkDate
                };
            }).sort((a, b) => b.remainingDebt - a.remainingDebt);
            
            customersWithDebt.forEach(item => {
                csvContent += `${this.escapeCSV(item.customer.name)},${this.escapeCSV(item.customer.phone || '')},${item.totalAmount.toFixed(2).replace('.', ',')},${item.totalPaid.toFixed(2).replace('.', ',')},${item.remainingDebt.toFixed(2).replace('.', ',')},${item.workCount},${this.formatDateForCSV(item.lastWorkDate)}\n`;
            });
            
            this.downloadFile(csvContent, fileName, 'text/csv;charset=utf-8;');
            this.showNotification('Borç raporu Excel formatında indirildi!', 'success');
        } catch (error) {
            console.error('Borç raporu dışa aktarma hatası:', error);
            this.showNotification('Dışa aktarma sırasında bir hata oluştu!', 'error');
        }
    }


    // Modal açma
    openModal() {
        const modal = document.getElementById('customerDetailsModal');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Sayfa kaydırmayı engelle
    }

    // Modal kapama
    closeModal() {
        const modal = document.getElementById('customerDetailsModal');
        modal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Sayfa kaydırmayı geri aç
    }

    // Silme modal açma
    openDeleteModal() {
        const modal = document.getElementById('deleteConfirmModal');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Sayfa kaydırmayı engelle
    }

    // Silme modal kapama
    closeDeleteModal() {
        const modal = document.getElementById('deleteConfirmModal');
        modal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Sayfa kaydırmayı geri aç
    }

    // İşlem silme modal açma
    openDeleteWorkModal() {
        console.log('openDeleteWorkModal çağrıldı');
        const modal = document.getElementById('deleteWorkConfirmModal');
        if (!modal) {
            console.error('deleteWorkConfirmModal bulunamadı!');
            return;
        }
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Sayfa kaydırmayı engelle
        console.log('Modal açıldı');
    }

    // İşlem silme modal kapama
    closeDeleteWorkModal() {
        const modal = document.getElementById('deleteWorkConfirmModal');
        modal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Sayfa kaydırmayı geri aç
    }

    // İşlem düzenleme modal açma
    openEditWorkModal() {
        const modal = document.getElementById('editWorkModal');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Sayfa kaydırmayı engelle
    }

    // İşlem düzenleme modal kapama
    closeEditWorkModal() {
        const modal = document.getElementById('editWorkModal');
        modal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Sayfa kaydırmayı geri aç
        this.currentEditWorkId = null;
    }

    // İşlem düzenleme modal'ını aç
    editWork(id) {
        const work = this.works.find(w => w.id === id);
        if (!work) {
            this.showNotification('Düzenlenecek işlem bulunamadı!', 'error');
            return;
        }

        // Form alanlarını doldur
        document.getElementById('editSelectedCustomer').value = work.customerId;
        document.getElementById('editWorkDate').value = work.date;
        document.getElementById('editMaterialType').value = work.materialType || '';
        document.getElementById('editPaintType').value = work.paintType || '';
        document.getElementById('editWorkDescription').value = work.description;
        document.getElementById('editWorkQuantity').value = work.quantity || 1;
        document.getElementById('editWorkUnitPrice').value = work.unitPrice || work.price;

        // Toplam fiyatı hesapla
        this.calculateEditTotalPrice();

        // Modal'ı aç
        this.currentEditWorkId = id;
        this.openEditWorkModal();
    }

    // Düzenleme formunda toplam fiyat hesapla
    calculateEditTotalPrice() {
        const quantity = parseFloat(document.getElementById('editWorkQuantity').value) || 0;
        const unitPrice = parseFloat(document.getElementById('editWorkUnitPrice').value) || 0;
        const totalPrice = quantity * unitPrice;
        
        document.getElementById('editTotalPriceDisplay').textContent = 
            `₺${totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;
    }

    // İşlem düzenleme kaydet
    async saveEditWork() {
        if (!this.currentEditWorkId) {
            return;
        }

        const selectedCustomerId = parseInt(document.getElementById('editSelectedCustomer').value);
        const workDate = document.getElementById('editWorkDate').value;
        const materialType = document.getElementById('editMaterialType').value;
        const paintType = document.getElementById('editPaintType').value;
        const workDescription = document.getElementById('editWorkDescription').value.trim();
        const quantity = parseInt(document.getElementById('editWorkQuantity').value);
        const unitPrice = parseFloat(document.getElementById('editWorkUnitPrice').value);

        // Validasyon
        if (!selectedCustomerId || !workDate || !materialType || !paintType || !workDescription || isNaN(quantity) || quantity <= 0 || isNaN(unitPrice) || unitPrice <= 0) {
            this.showNotification('Lütfen tüm alanları doğru şekilde doldurun!', 'error');
            return;
        }

        // Müşteriyi bul
        const customer = this.customers.find(c => c.id === selectedCustomerId);
        if (!customer) {
            this.showNotification('Seçilen müşteri bulunamadı!', 'error');
            return;
        }

        // Toplam fiyatı hesapla
        const totalPrice = quantity * unitPrice;

        try {
            // API'ye güncellenmiş işlem gönder
            const response = await fetch(`/api/works/${this.currentEditWorkId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerId: selectedCustomerId,
                    customerName: customer.name,
                    date: workDate,
                    materialType: materialType,
                    paintType: paintType,
                    description: workDescription,
                    quantity: quantity,
                    unitPrice: unitPrice,
                    price: totalPrice
                })
            });

            if (response.ok) {
                // Yerel veriyi güncelle
                const workIndex = this.works.findIndex(w => w.id === this.currentEditWorkId);
                if (workIndex !== -1) {
                    this.works[workIndex] = {
                        ...this.works[workIndex],
                        customerId: selectedCustomerId,
                        customerName: customer.name,
                        date: workDate,
                        materialType: materialType,
                        paintType: paintType,
                        description: workDescription,
                        quantity: quantity,
                        unitPrice: unitPrice,
                        price: totalPrice
                    };
                }

                this.updateDisplay();
                this.updateCustomerDebtInfo();
                this.closeEditWorkModal();
                
                this.showNotification('İşlem başarıyla güncellendi!', 'success');
            } else {
                this.showNotification('İşlem güncellenirken hata oluştu!', 'error');
            }
        } catch (error) {
            console.error('İşlem güncelleme hatası:', error);
            this.showNotification('İşlem güncellenirken hata oluştu!', 'error');
        }
    }

    // Müşteri detaylarını görüntüle
    viewCustomerDetails() {
        if (!this.selectedCustomer) {
            this.showNotification('Görüntülenecek müşteri seçilmedi!', 'warning');
            return;
        }

        const customer = this.selectedCustomer;
        const customerWorks = this.works.filter(work => work.customerId === customer.id);
        const customerPayments = this.payments.filter(payment => payment.customerId === customer.id);
        
        const totalAmount = customerWorks.reduce((sum, work) => sum + work.price, 0);
        const totalPaid = customerPayments.reduce((sum, payment) => sum + payment.amount, 0);
        const remainingDebt = totalAmount - totalPaid;

        // Modal içeriğini oluştur
        let modalContent = `
            <h4><i class="fas fa-user"></i> Müşteri Bilgileri</h4>
            <div class="info-row">
                <span class="info-label">Ad:</span>
                <span class="info-value">${this.escapeHtml(customer.name)}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Telefon:</span>
                <span class="info-value">${customer.phone || 'Belirtilmemiş'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Adres:</span>
                <span class="info-value">${customer.address || 'Belirtilmemiş'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Kayıt Tarihi:</span>
                <span class="info-value">${this.formatDate(customer.createdAt)}</span>
            </div>

            <h4><i class="fas fa-chart-line"></i> Borç Bilgileri</h4>
            <div class="info-row">
                <span class="info-label">Toplam Borç:</span>
                <span class="info-value">₺${totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Ödenen:</span>
                <span class="info-value">₺${totalPaid.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Kalan Borç:</span>
                <span class="info-value">₺${remainingDebt.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div class="info-row">
                <span class="info-label">İşlem Sayısı:</span>
                <span class="info-value">${customerWorks.length}</span>
            </div>
        `;

        // İşlemler bölümü
        if (customerWorks.length > 0) {
            modalContent += `<h4><i class="fas fa-tools"></i> İşlemler (${customerWorks.length})</h4>`;
            customerWorks.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach((work, index) => {
                modalContent += `
                    <div class="work-item">
                        <div class="work-date">${this.formatDate(work.date)}</div>
                        <div class="work-desc">${this.escapeHtml(work.description)}</div>
                        <div class="work-details">
                            Malzeme: ${this.escapeHtml(work.materialType || 'Belirtilmemiş')} | 
                            Boya: ${this.escapeHtml(work.paintType || 'Belirtilmemiş')} | 
                            Adet: ${work.quantity || 1} | 
                            Fiyat: ₺${work.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                        </div>
                    </div>
                `;
            });
        }

        // Ödemeler bölümü
        if (customerPayments.length > 0) {
            modalContent += `<h4><i class="fas fa-money-bill-wave"></i> Ödemeler (${customerPayments.length})</h4>`;
            customerPayments.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach((payment, index) => {
                modalContent += `
                    <div class="payment-item">
                        <div class="payment-date">${this.formatDate(payment.date)}</div>
                        <div class="payment-amount">₺${payment.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</div>
                        <div class="payment-method">${payment.method}${payment.note ? ' - ' + this.escapeHtml(payment.note) : ''}</div>
                    </div>
                `;
            });
        }

        // Modal içeriğini yükle ve aç
        document.getElementById('modalBody').innerHTML = modalContent;
        this.openModal();
    }
}

// Sayfa yüklendiğinde müşteri işlem yöneticisini başlat
let customerWorkManager;
document.addEventListener('DOMContentLoaded', () => {
    customerWorkManager = new CustomerWorkManager();
    
    // Sayfa başlığına istatistikleri ekle
    const updateTitle = () => {
        const stats = customerWorkManager.getStatistics();
        document.title = `Mercury - ${stats.totalCustomers} Müşteri, ${stats.totalWorks} İşlem, Borç: ₺${stats.totalDebt.toLocaleString('tr-TR', { minimumFractionDigits: 0 })}`;
    };
    
    updateTitle();
    
    // Veri değiştiğinde başlığı güncelle
    const originalAddCustomer = customerWorkManager.addCustomer.bind(customerWorkManager);
    customerWorkManager.addCustomer = function() {
        originalAddCustomer();
        updateTitle();
    };
    
    const originalAddWork = customerWorkManager.addWork.bind(customerWorkManager);
    customerWorkManager.addWork = function() {
        originalAddWork();
        updateTitle();
    };
    
    const originalAddPayment = customerWorkManager.addPayment.bind(customerWorkManager);
    customerWorkManager.addPayment = function() {
        originalAddPayment();
        updateTitle();
    };
    
    const originalDeleteWork = customerWorkManager.deleteWork.bind(customerWorkManager);
    customerWorkManager.deleteWork = function(id) {
        originalDeleteWork(id);
        updateTitle();
    };
    
    const originalClearAllData = customerWorkManager.clearAllData.bind(customerWorkManager);
    customerWorkManager.clearAllData = function() {
        originalClearAllData();
        updateTitle();
    };
});

// Klavye kısayolları
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter ile form gönder
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.closest('form')) {
            activeElement.closest('form').dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape ile arama temizle
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('searchCustomer');
        if (searchInput && searchInput === document.activeElement) {
            searchInput.value = '';
            customerWorkManager.currentSearch = '';
            customerWorkManager.updateDisplay();
        }
    }
});

// Sayfa kapatılırken uyarı (veri kaybı olmasın diye)
window.addEventListener('beforeunload', (e) => {
    const customerForm = document.getElementById('customerForm');
    const workForm = document.getElementById('workForm');
    
    const hasCustomerData = customerForm && (
        document.getElementById('customerName').value.trim()
    );
    
    const hasWorkData = workForm && (
        document.getElementById('selectedCustomer').value ||
        document.getElementById('workDescription').value.trim() ||
        document.getElementById('price').value
    );
    
    if (hasCustomerData || hasWorkData) {
        e.preventDefault();
        e.returnValue = 'Formda doldurulmamış veriler var. Sayfayı kapatmak istediğinizden emin misiniz?';
    }
});