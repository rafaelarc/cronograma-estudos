class StudyScheduleGenerator {
    constructor() {
        this.schedules = this.loadSchedules();
        this.currentSchedule = null;
        this.initializeEventListeners();
        this.loadHistory();
    }

    initializeEventListeners() {
        // Form submission
        const studyForm = document.getElementById('studyForm');
        if (studyForm) {
            studyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.generateSchedule();
            });
        }

        // Add subject button
        const addSubjectBtn = document.getElementById('addSubject');
        if (addSubjectBtn) {
            addSubjectBtn.addEventListener('click', () => {
                this.addSubjectField();
            });
        }

        // Export buttons
        const exportExcelBtn = document.getElementById('exportExcel');
        if (exportExcelBtn) {
            exportExcelBtn.addEventListener('click', () => {
                this.exportToExcel();
            });
        }

        const exportPDFBtn = document.getElementById('exportPDF');
        if (exportPDFBtn) {
            exportPDFBtn.addEventListener('click', () => {
                this.exportToPDF();
            });
        }

        const saveScheduleBtn = document.getElementById('saveSchedule');
        if (saveScheduleBtn) {
            saveScheduleBtn.addEventListener('click', () => {
                this.saveCurrentSchedule();
            });
        }

        // Tab navigation
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        const examDateInput = document.getElementById('examDate');
        if (examDateInput) {
            examDateInput.setAttribute('min', today);
        }
    }

    addSubjectField() {
        const container = document.getElementById('subjectsContainer');
        if (!container) return;
        
        const subjectItem = document.createElement('div');
        subjectItem.className = 'subject-item';
        subjectItem.innerHTML = `
            <input type="text" placeholder="Nome da matéria" class="subject-name" required>
            <input type="number" placeholder="Peso" class="subject-weight" min="1" max="10" value="1" required>
            <button type="button" class="remove-subject">Remover</button>
        `;
        
        container.appendChild(subjectItem);
        
        // Add remove functionality
        subjectItem.querySelector('.remove-subject').addEventListener('click', () => {
            subjectItem.remove();
        });
    }

    getFormData() {
        const examDateInput = document.getElementById('examDate');
        const hoursPerDayInput = document.getElementById('hoursPerDay');
        
        if (!examDateInput || !hoursPerDayInput) {
            return null;
        }
        
        const examDate = examDateInput.value;
        const hoursPerDay = parseInt(hoursPerDayInput.value);
        const availableDays = Array.from(document.querySelectorAll('input[name="availableDays"]:checked'))
            .map(checkbox => checkbox.value);

        const subjects = [];
        const subjectItems = document.querySelectorAll('.subject-item');
        subjectItems.forEach(item => {
            const name = item.querySelector('.subject-name').value.trim();
            const weight = parseInt(item.querySelector('.subject-weight').value);
            if (name && weight) {
                subjects.push({ name, weight });
            }
        });

        return { examDate, hoursPerDay, availableDays, subjects };
    }

    validateFormData(data) {
        if (data.subjects.length === 0) {
            alert('Adicione pelo menos uma matéria.');
            return false;
        }

        if (data.availableDays.length === 0) {
            alert('Selecione pelo menos um dia da semana disponível.');
            return false;
        }

        if (data.hoursPerDay < 1 || data.hoursPerDay > 12) {
            alert('Horas de estudo deve estar entre 1 e 12.');
            return false;
        }

        if (data.examDate) {
            const examDate = new Date(data.examDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (examDate <= today) {
                alert('A data da prova deve ser futura.');
                return false;
            }
        }

        return true;
    }

    calculateSchedule(data) {
        const { examDate, hoursPerDay, availableDays, subjects } = data;
        
        // Calculate total weight
        const totalWeight = subjects.reduce((sum, subject) => sum + subject.weight, 0);
        
        // Calculate available days
        let studyDays = [];
        if (examDate) {
            // Countdown mode - calculate days until exam
            const examDateObj = new Date(examDate);
            const today = new Date();
            const daysUntilExam = Math.ceil((examDateObj - today) / (1000 * 60 * 60 * 24));
            
            // Generate study days considering available days of week
            const dayNames = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
            for (let i = 0; i < daysUntilExam; i++) {
                const currentDate = new Date(today);
                currentDate.setDate(today.getDate() + i);
                const dayName = dayNames[currentDate.getDay()];
                
                if (availableDays.includes(dayName)) {
                    studyDays.push({
                        date: new Date(currentDate),
                        dayName: dayName
                    });
                }
            }
        } else {
            // Continuous mode - generate 30 days
            const dayNames = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
            const today = new Date();
            
            for (let i = 0; i < 30; i++) {
                const currentDate = new Date(today);
                currentDate.setDate(today.getDate() + i);
                const dayName = dayNames[currentDate.getDay()];
                
                if (availableDays.includes(dayName)) {
                    studyDays.push({
                        date: new Date(currentDate),
                        dayName: dayName
                    });
                }
            }
        }

        // Calculate hours per subject
        const totalStudyHours = studyDays.length * hoursPerDay;
        const subjectHours = subjects.map(subject => ({
            ...subject,
            totalHours: Math.round((subject.weight / totalWeight) * totalStudyHours)
        }));

        // Distribute hours across days
        const schedule = [];
        const subjectIndex = Array.from({ length: subjects.length }, (_, i) => i);
        let subjectHourCounters = subjects.map(() => 0);

        studyDays.forEach((day, dayIndex) => {
            const daySchedule = [];
            let remainingHours = hoursPerDay;
            let subjectsForDay = [...subjectIndex];

            // Shuffle subjects to avoid repetition
            if (dayIndex > 0) {
                subjectsForDay = this.shuffleArray(subjectsForDay);
            }

            // Distribute hours for this day
            while (remainingHours > 0 && subjectsForDay.length > 0) {
                for (let i = subjectsForDay.length - 1; i >= 0; i--) {
                    const subjectIdx = subjectsForDay[i];
                    const subject = subjectHours[subjectIdx];
                    
                    if (subjectHourCounters[subjectIdx] < subject.totalHours && remainingHours > 0) {
                        const hoursToAssign = Math.min(remainingHours, 2); // Max 2 hours per subject per day
                        const actualHours = Math.min(hoursToAssign, subject.totalHours - subjectHourCounters[subjectIdx]);
                        
                        if (actualHours > 0) {
                            daySchedule.push({
                                subject: subject.name,
                                hours: actualHours,
                                weight: subject.weight
                            });
                            
                            subjectHourCounters[subjectIdx] += actualHours;
                            remainingHours -= actualHours;
                        }
                    }
                    
                    // Remove subject if it has reached its total hours
                    if (subjectHourCounters[subjectIdx] >= subject.totalHours) {
                        subjectsForDay.splice(i, 1);
                    }
                }
            }

            schedule.push({
                date: day.date,
                dayName: day.dayName,
                subjects: daySchedule
            });
        });

        return {
            schedule,
            summary: {
                totalDays: studyDays.length,
                totalHours: totalStudyHours,
                subjects: subjectHours,
                examDate: examDate || null
            }
        };
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    generateSchedule() {
        const formData = this.getFormData();
        
        if (!formData) {
            console.log('Formulário não encontrado - página do blog');
            return;
        }
        
        if (!this.validateFormData(formData)) {
            return;
        }

        try {
            this.currentSchedule = this.calculateSchedule(formData);
            this.displaySchedule();
            const resultsSection = document.getElementById('resultsSection');
            if (resultsSection) {
                resultsSection.style.display = 'block';
                resultsSection.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Erro ao gerar cronograma:', error);
            alert('Erro ao gerar cronograma. Verifique os dados inseridos.');
        }
    }

    displaySchedule() {
        if (!this.currentSchedule) return;

        const tableContainer = document.getElementById('scheduleTable');
        if (!tableContainer) return;
        
        const { schedule, summary } = this.currentSchedule;

        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Dia</th>
                        <th>Matérias</th>
                        <th>Horas</th>
                        <th>Total do Dia</th>
                    </tr>
                </thead>
                <tbody>
        `;

        schedule.forEach(day => {
            const subjectsHTML = day.subjects.map(subject => 
                `<div class="subject-cell">${subject.subject}</div>`
            ).join('');
            
            const hoursHTML = day.subjects.map(subject => 
                `<div class="hours-cell">${subject.hours}h</div>`
            ).join('');
            
            const totalHours = day.subjects.reduce((sum, subject) => sum + subject.hours, 0);
            
            tableHTML += `
                <tr>
                    <td>${this.formatDate(day.date)}</td>
                    <td>${this.capitalizeFirst(day.dayName)}</td>
                    <td>${subjectsHTML}</td>
                    <td>${hoursHTML}</td>
                    <td class="hours-cell">${totalHours}h</td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        // Add summary
        const summaryHTML = `
            <div style="margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                <h3>Resumo do Cronograma</h3>
                <p><strong>Total de dias de estudo:</strong> ${summary.totalDays}</p>
                <p><strong>Total de horas:</strong> ${summary.totalHours}h</p>
                ${summary.examDate ? `<p><strong>Data da prova:</strong> ${this.formatDate(new Date(summary.examDate))}</p>` : ''}
                <h4>Distribuição por Matéria:</h4>
                <ul>
                    ${summary.subjects.map(subject => 
                        `<li><strong>${subject.name}:</strong> ${subject.totalHours}h (peso: ${subject.weight})</li>`
                    ).join('')}
                </ul>
            </div>
        `;

        tableContainer.innerHTML = tableHTML + summaryHTML;
    }

    formatDate(date) {
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    exportToExcel() {
        if (!this.currentSchedule) {
            alert('Gere um cronograma primeiro.');
            return;
        }

        const { schedule } = this.currentSchedule;
        if (!schedule) return;
        
        const data = [];

        // Headers
        data.push(['Data', 'Dia', 'Matéria', 'Horas']);

        // Data rows
        schedule.forEach(day => {
            if (day.subjects.length === 0) {
                data.push([this.formatDate(day.date), this.capitalizeFirst(day.dayName), '', '']);
            } else {
                day.subjects.forEach(subject => {
                    data.push([
                        this.formatDate(day.date),
                        this.capitalizeFirst(day.dayName),
                        subject.subject,
                        subject.hours
                    ]);
                });
            }
        });

        // Create workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(data);
        
        // Set column widths
        ws['!cols'] = [
            { width: 12 },
            { width: 10 },
            { width: 20 },
            { width: 8 }
        ];

        XLSX.utils.book_append_sheet(wb, ws, 'Cronograma de Estudo');
        
        // Generate filename
        const today = new Date().toISOString().split('T')[0];
        const filename = `cronograma_estudo_${today}.xlsx`;
        
        XLSX.writeFile(wb, filename);
    }

    exportToPDF() {
        if (!this.currentSchedule) {
            alert('Gere um cronograma primeiro.');
            return;
        }

        const { jsPDF } = window.jspdf;
        if (!jsPDF) {
            alert('Biblioteca PDF não carregada.');
            return;
        }
        
        const { schedule } = this.currentSchedule;
        if (!schedule) return;
        const doc = new jsPDF();
        
        // Title
        doc.setFontSize(20);
        doc.text('Cronograma de Estudo Personalizado', 20, 20);
        
        // Date
        doc.setFontSize(12);
        doc.text(`Gerado em: ${this.formatDate(new Date())}`, 20, 30);
        
        // Summary
        const { summary } = this.currentSchedule;
        let yPosition = 50;
        
        doc.setFontSize(14);
        doc.text('Resumo:', 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        doc.text(`Total de dias: ${summary.totalDays}`, 20, yPosition);
        yPosition += 7;
        doc.text(`Total de horas: ${summary.totalHours}h`, 20, yPosition);
        yPosition += 7;
        
        if (summary.examDate) {
            doc.text(`Data da prova: ${this.formatDate(new Date(summary.examDate))}`, 20, yPosition);
            yPosition += 7;
        }
        
        yPosition += 10;
        
        // Subjects summary
        doc.setFontSize(12);
        doc.text('Distribuição por Matéria:', 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        summary.subjects.forEach(subject => {
            doc.text(`${subject.name}: ${subject.totalHours}h (peso: ${subject.weight})`, 20, yPosition);
            yPosition += 7;
        });
        
        yPosition += 15;
        
        // Schedule table
        doc.setFontSize(12);
        doc.text('Cronograma Detalhado:', 20, yPosition);
        yPosition += 10;
        
        const tableData = [];
        tableData.push(['Data', 'Dia', 'Matéria', 'Horas']);
        
        this.currentSchedule.schedule.forEach(day => {
            if (day.subjects.length === 0) {
                tableData.push([this.formatDate(day.date), this.capitalizeFirst(day.dayName), '', '']);
            } else {
                day.subjects.forEach(subject => {
                    tableData.push([
                        this.formatDate(day.date),
                        this.capitalizeFirst(day.dayName),
                        subject.subject,
                        subject.hours.toString()
                    ]);
                });
            }
        });
        
        doc.autoTable({
            startY: yPosition,
            head: [tableData[0]],
            body: tableData.slice(1),
            styles: { fontSize: 8 },
            headStyles: { fillColor: [102, 126, 234] },
            margin: { left: 20, right: 20 }
        });
        
        // Generate filename
        const today = new Date().toISOString().split('T')[0];
        const filename = `cronograma_estudo_${today}.pdf`;
        
        doc.save(filename);
    }

    saveCurrentSchedule() {
        if (!this.currentSchedule) {
            alert('Gere um cronograma primeiro.');
            return;
        }

        const scheduleData = {
            id: Date.now().toString(),
            title: `Cronograma - ${this.formatDate(new Date())}`,
            date: new Date().toISOString(),
            data: this.currentSchedule,
            formData: this.getFormData()
        };

        this.schedules.push(scheduleData);
        this.saveSchedules();
        this.loadHistory();
        
        alert('Cronograma salvo com sucesso!');
    }

    loadSchedules() {
        try {
            const saved = localStorage.getItem('studySchedules');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Erro ao carregar cronogramas salvos:', error);
            return [];
        }
    }

    saveSchedules() {
        try {
            localStorage.setItem('studySchedules', JSON.stringify(this.schedules));
        } catch (error) {
            console.error('Erro ao salvar cronogramas:', error);
        }
    }

    switchTab(tabName) {
        // Remove active class from all tabs and buttons
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to selected tab and button
        const tabButton = document.querySelector(`[data-tab="${tabName}"]`);
        const tabContent = document.getElementById(`${tabName}-tab`);
        
        if (tabButton) tabButton.classList.add('active');
        if (tabContent) tabContent.classList.add('active');
        
        // If switching to history tab, load the history
        if (tabName === 'history') {
            this.loadHistory();
        }
    }

    loadHistory() {
        const savedSchedules = document.getElementById('savedSchedules');
        if (!savedSchedules) return;
        
        if (this.schedules.length === 0) {
            savedSchedules.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #718096;">
                    <h3>Nenhum cronograma salvo ainda</h3>
                    <p>Gere seu primeiro cronograma e salve-o para aparecer aqui!</p>
                </div>
            `;
            return;
        }
        
        savedSchedules.innerHTML = this.schedules.map(schedule => `
            <div class="saved-schedule-item">
                <div class="saved-schedule-header">
                    <div class="saved-schedule-title">${schedule.title}</div>
                    <div class="saved-schedule-date">${this.formatDate(new Date(schedule.date))}</div>
                </div>
                <div class="saved-schedule-info">
                    <p><strong>Dias:</strong> ${schedule.data.summary.totalDays} | 
                       <strong>Horas:</strong> ${schedule.data.summary.totalHours}h | 
                       <strong>Matérias:</strong> ${schedule.data.summary.subjects.length}</p>
                    ${schedule.data.summary.examDate ? 
                        `<p><strong>Prova:</strong> ${this.formatDate(new Date(schedule.data.summary.examDate))}</p>` : 
                        '<p><strong>Tipo:</strong> Cronograma contínuo</p>'
                    }
                </div>
                <div class="saved-schedule-actions">
                    <button class="load-schedule" onclick="studyGenerator.loadSchedule('${schedule.id}')">
                        Carregar
                    </button>
                    <button class="delete-schedule" onclick="studyGenerator.deleteSchedule('${schedule.id}')">
                        Excluir
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadSchedule(scheduleId) {
        const schedule = this.schedules.find(s => s.id === scheduleId);
        if (!schedule) return;

        // Load form data
        const formData = schedule.formData;
        
        const examDateInput = document.getElementById('examDate');
        const hoursPerDayInput = document.getElementById('hoursPerDay');
        
        if (examDateInput) examDateInput.value = formData.examDate || '';
        if (hoursPerDayInput) hoursPerDayInput.value = formData.hoursPerDay;
        
        // Clear existing checkboxes
        document.querySelectorAll('input[name="availableDays"]').forEach(cb => cb.checked = false);
        
        // Check available days
        formData.availableDays.forEach(day => {
            const checkbox = document.querySelector(`input[name="availableDays"][value="${day}"]`);
            if (checkbox) checkbox.checked = true;
        });
        
        // Clear and populate subjects
        const subjectsContainer = document.getElementById('subjectsContainer');
        if (subjectsContainer) {
            subjectsContainer.innerHTML = '';
            
            formData.subjects.forEach(subject => {
                this.addSubjectField();
                const lastItem = subjectsContainer.lastElementChild;
                if (lastItem) {
                    const nameInput = lastItem.querySelector('.subject-name');
                    const weightInput = lastItem.querySelector('.subject-weight');
                    if (nameInput) nameInput.value = subject.name;
                    if (weightInput) weightInput.value = subject.weight;
                }
            });
        }
        
        // Load schedule data
        this.currentSchedule = schedule.data;
        this.displaySchedule();
        
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection) {
            resultsSection.style.display = 'block';
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    deleteSchedule(scheduleId) {
        if (confirm('Tem certeza que deseja excluir este cronograma?')) {
            this.schedules = this.schedules.filter(s => s.id !== scheduleId);
            this.saveSchedules();
            this.loadHistory();
        }
    }
}

// Initialize the application
const studyGenerator = new StudyScheduleGenerator();

// Global function for CTA button in guide
function switchTab(tabName) {
    studyGenerator.switchTab(tabName);
}

// Footer button functions
function showFAQ() {
    // Check if we're on a blog page
    if (window.location.pathname.includes('/blog/')) {
        // Redirect to main page FAQ section
        window.location.href = '../index.html#faq';
        return;
    }
    
    // Switch to guide tab and scroll to FAQ section
    studyGenerator.switchTab('guide');
    
    // Scroll to FAQ section after a short delay
    setTimeout(() => {
        const faqSection = document.querySelector('#faq');
        if (faqSection) {
            faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);
}

function buyCoffee() {
    // Create a modal for coffee support
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 12px;
        max-width: 400px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;
    
    modalContent.innerHTML = `
        <h3 style="color: #2d3748; margin-bottom: 20px;">☕ Me compre um café!</h3>
        <p style="color: #4a5568; margin-bottom: 25px; line-height: 1.6;">
            Obrigado por usar nossa ferramenta! Se ela te ajudou nos estudos, 
            considere me pagar um café para continuar desenvolvendo ferramentas úteis.
        </p>
        <div style="margin-bottom: 20px;">
            <button onclick="openBuyMeCoffee()" style="
                background: #ffdd00;
                color: #2d3748;
                border: none;
                padding: 15px 30px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                font-size: 16px;
                width: 100%;
                transition: background-color 0.3s ease;
            " onmouseover="this.style.backgroundColor='#ffed4e'" onmouseout="this.style.backgroundColor='#ffdd00'">
                ☕ Buy Me a Coffee
            </button>
        </div>
        <button onclick="closeModal()" style="
            background: #e2e8f0;
            color: #4a5568;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
        ">Fechar</button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.querySelector('div[style*="position: fixed"]');
    if (modal) {
        modal.remove();
    }
}

function openBuyMeCoffee() {
    // Open Buy Me a Coffee page
    window.open('https://buymeacoffee.com/rafaelarc', '_blank');
    closeModal();
}

// Handle FAQ hash on page load
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.hash === '#faq') {
        setTimeout(() => {
            showFAQ();
        }, 500);
    }
});
