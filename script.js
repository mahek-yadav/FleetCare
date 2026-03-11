// Fleet Data Array
const fleetData = [
  { id: "V-101", name: "Mercedes Actros", image: "assets/fleet_truck_actros.png", mileage: 14800, serviceDue: 15000, fuelUsed: 50, distanceTravelled: 700, lastService: "2025-12-01", status: "active" },
  { id: "V-102", name: "Volvo FH16", image: "assets/fleet_truck_volvo.png", mileage: 36200, serviceDue: 35000, fuelUsed: 60, distanceTravelled: 720, lastService: "2025-11-15", status: "active" },
  { id: "V-103", name: "Scania R500", image: "assets/fleet_truck_scania.png", mileage: 22000, serviceDue: 25000, fuelUsed: 40, distanceTravelled: 600, lastService: "2026-01-10", status: "active" },
  { id: "V-104", name: "MAN TGX", image: "assets/fleet_truck_man.png", mileage: 14200, serviceDue: 15000, fuelUsed: 55, distanceTravelled: 650, lastService: "2026-02-05", status: "active" },
  { id: "V-105", name: "Peterbilt 579", image: "assets/fleet_truck_peterbilt.png", mileage: 41000, serviceDue: 45000, fuelUsed: 52, distanceTravelled: 780, lastService: "2025-10-20", status: "active" },
  
];

// Reusable Functions
function checkServiceStatus(mileage, serviceDue) {
  if (mileage >= serviceDue) return { text: "Service Required", class: "critical", color: "var(--status-critical)" };
  if (mileage >= serviceDue - 1000) return { text: "Service Soon", class: "warning", color: "var(--status-warning)" };
  return { text: "Good", class: "good", color: "var(--status-good)" };
}

function calculateFuelEfficiency(distance, fuel) {
  if (fuel === 0) return 0;
  return (distance / fuel).toFixed(1);
}

// Generate Vehicle Cards (Vehicles Page)
function generateVehicleCards() {
  const container = document.getElementById("vehicles-container");
  if (!container) return;
  
  let html = "";
  fleetData.forEach(v => {
    const status = checkServiceStatus(v.mileage, v.serviceDue);
    const eff = calculateFuelEfficiency(v.distanceTravelled, v.fuelUsed);
    
    html += `
      <div class="card glow-border vehicle-card" style="border-left: 4px solid ${status.color}; display: flex; flex-direction: column;">
        <div class="flex items-center justify-between mb-2">
            <div>
                <h3 style="color: var(--text-white); margin-bottom: 2px;">${v.id}</h3>
                <p class="text-muted" style="font-size: 0.85rem;">${v.name}</p>
            </div>
            <span class="badge ${status.class}">${status.text}</span>
        </div>
        
        <div class="vehicle-image-container" style="flex: 1; min-height: 140px; display: flex; align-items: center; justify-content: center; overflow: hidden; margin: 10px -10px;">
            <img src="${v.image}" alt="${v.name}" style="max-width: 100%; max-height: 140px; object-fit: contain; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5)); transform: scale(1.1);">
        </div>

        <hr style="border: 0; border-top: var(--border-thin); margin: var(--spacing-sm) 0;">
        <div class="flex-col" style="gap: 5px;">
            <div class="flex justify-between blur-text"><span class="text-muted">Mileage:</span> <strong>${v.mileage.toLocaleString()} km</strong></div>
            <div class="flex justify-between blur-text"><span class="text-muted">Next Service:</span> <strong>${v.serviceDue.toLocaleString()} km</strong></div>
            <div class="flex justify-between blur-text"><span class="text-muted">Efficiency:</span> <strong style="color: var(--neon-blue);">${eff} km/L</strong></div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// Maintenance Page Logic
function updateMaintenanceTable() {
    const tbody = document.getElementById("maintenance-tbody");
    if (!tbody) return;
    
    let html = "";
    fleetData.forEach(v => {
      const status = checkServiceStatus(v.mileage, v.serviceDue);
      html += `
        <tr>
          <td><strong>${v.id}</strong></td>
          <td>${v.name}</td>
          <td>${v.mileage.toLocaleString()} km</td>
          <td>${v.serviceDue.toLocaleString()} km</td>
          <td><span class="badge ${status.class}">${status.text}</span></td>
          <td>${v.lastService}</td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
}

// Fuel Page Logic
function updateFuelMonitoring() {
    const tbody = document.getElementById("fuel-tbody");
    if (!tbody) return;
    
    let html = "";
    let bestEff = 0; let bestVeh = "";
    let worstEff = 999; let worstVeh = "";

    fleetData.forEach(v => {
      const eff = parseFloat(calculateFuelEfficiency(v.distanceTravelled, v.fuelUsed));
      
      if (eff > bestEff) { bestEff = eff; bestVeh = v.id; }
      if (eff < worstEff) { worstEff = eff; worstVeh = v.id; }

      let effColor = "var(--text-white)";
      if (eff >= 14) effColor = "var(--status-good)";
      if (eff <= 12) effColor = "var(--status-critical)";

      html += `
        <tr>
          <td><strong>${v.id}</strong></td>
          <td>${v.distanceTravelled} km</td>
          <td>${v.fuelUsed} L</td>
          <td style="color: ${effColor}; font-weight: bold;">${eff} km/L</td>
        </tr>
      `;
    });
    
    tbody.innerHTML = html;
    
    // Most/Least efficient
    const topCard = document.getElementById("most-efficient");
    const bottomCard = document.getElementById("least-efficient");
    if (topCard) topCard.innerHTML = `<h3 style="color: var(--status-good);">${bestVeh}</h3><p>${bestEff} km/L</p>`;
    if (bottomCard) bottomCard.innerHTML = `<h3 style="color: var(--status-critical);">${worstVeh}</h3><p>${worstEff} km/L</p>`;
}

// Reports & Alerts (Reports Page)
function generateAlerts() {
    const urgentContainer = document.getElementById("urgent-alerts");
    if (!urgentContainer) return;

    let alertHtml = "";
    let highMileageVehicle = { id: "", mileage: 0 };

    fleetData.forEach(v => {
        const status = checkServiceStatus(v.mileage, v.serviceDue);
        if (status.class === "critical" || status.class === "warning") {
            const icon = status.class === "critical" ? "fa-exclamation-circle" : "fa-triangle-exclamation";
            alertHtml += `
                <div class="card" style="border-left: 4px solid ${status.color}; padding: var(--spacing-sm) var(--spacing-md); margin-bottom: var(--spacing-sm);">
                    <div class="flex items-center gap-2">
                        <i class="fa-solid ${icon}" style="color: ${status.color}; font-size: 1.2rem;"></i>
                        <div><strong>${v.id} (${v.name})</strong> - ${status.text} at ${v.mileage.toLocaleString()} km.</div>
                    </div>
                </div>
            `;
        }
        if (v.mileage > highMileageVehicle.mileage) {
            highMileageVehicle = v;
        }
    });

    if (alertHtml === "") alertHtml = "<p class='text-muted'>No active alerts currently.</p>";
    urgentContainer.innerHTML = alertHtml;
    
    const insightHighMileage = document.getElementById("insight-high-mileage");
    if (insightHighMileage) insightHighMileage.innerHTML = `<strong>${highMileageVehicle.id}</strong> (${highMileageVehicle.mileage.toLocaleString()} km)`;
}

// Dashboard Overview Logic
function updateDashboardOverview() {
    const totalVehiclesEl = document.getElementById("overview-total-vehicles");
    const activeAlertsEl = document.getElementById("overview-active-alerts");
    const serviceDueEl = document.getElementById("overview-service-due");
    const avgFuelEl = document.getElementById("overview-avg-fuel");
    
    if (!totalVehiclesEl) return;
    
    let activeAlerts = 0;
    let serviceDue = 0;
    let totalFuel = 0;
    let totalDist = 0;
    let statusCounts = { good: 0, warning: 0, critical: 0 };
    
    fleetData.forEach(v => {
        const status = checkServiceStatus(v.mileage, v.serviceDue);
        if (status.class === "critical") statusCounts.critical++;
        else if (status.class === "warning") statusCounts.warning++;
        else statusCounts.good++;
        
        if (status.class === "critical" || status.class === "warning") {
            activeAlerts++;
        }
        if (status.class === "warning") {
            serviceDue++;
        }
        
        totalDist += v.distanceTravelled;
        totalFuel += v.fuelUsed;
    });

    if (totalVehiclesEl) totalVehiclesEl.innerText = fleetData.length;
    if (activeAlertsEl) activeAlertsEl.innerText = activeAlerts;
    if (serviceDueEl) serviceDueEl.innerText = statusCounts.warning;
    
    if (avgFuelEl) {
        const eff = totalFuel ? (totalDist / totalFuel).toFixed(1) : 0;
        avgFuelEl.innerText = eff;
    }

    // Pie Chart
    const pieCanvas = document.getElementById("statusPieChart");
    if (pieCanvas && window.Chart) {
        new Chart(pieCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Good', 'Service Soon', 'Service Required'],
                datasets: [{
                    data: [statusCounts.good, statusCounts.warning, statusCounts.critical],
                    backgroundColor: ['#00FF66', '#FFB800', '#FF1E1E'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#a0a0a0' } }
                }
            }
        });
    }

    // Bar Chart
    const barCanvas = document.getElementById("mileageBarChart");
    if (barCanvas && window.Chart) {
        const labels = fleetData.map(v => v.id);
        const data = fleetData.map(v => v.mileage);
        
        new Chart(barCanvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Mileage (km)',
                    data: data,
                    backgroundColor: '#00F0FF',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a0a0a0' } },
                    x: { grid: { display: false }, ticks: { color: '#a0a0a0' } }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
}

// Shared Sidebar Active State & Mobile Menu Toggle
function setupSidebar() {
    const currentPage = window.location.pathname.split("/").pop();
    const links = document.querySelectorAll('.sidebar-nav a');
    links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const headerMobileBtn = document.getElementById('header-mobile-btn');
    const appContainer = document.querySelector('.app-container');
    const navLinks = document.querySelector('.nav-links'); // For Landing Page

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
             navLinks.classList.toggle('active');
             const icon = mobileMenuBtn.querySelector('i');
             if (navLinks.classList.contains('active')) {
                  icon.classList.remove('fa-bars'); icon.classList.add('fa-times');
             } else {
                  icon.classList.remove('fa-times'); icon.classList.add('fa-bars');
             }
        });
    }

    if (headerMobileBtn && appContainer) {
        headerMobileBtn.addEventListener('click', () => {
             appContainer.classList.toggle('sidebar-open');
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setupSidebar();
    
    // Intersection Observer for scroll animations (.reveal)
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => revealObserver.observe(el));

    // Fire page-specific functions dynamically if their containers exist
    updateDashboardOverview();
    generateVehicleCards();
    updateMaintenanceTable();
    updateFuelMonitoring();
    generateAlerts();
});

// Toast system function
function showToast(msg, type="success") {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position: fixed; top: 100px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; pointer-events: none;';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'var(--status-good)' : (type === 'critical' ? 'var(--status-critical)' : 'var(--primary-accent)');
    let iconClass = 'fa-check-circle';
    if (type === 'error' || type === 'critical') iconClass = 'fa-triangle-exclamation';

    toast.style.cssText = `
        background: var(--bg-secondary);
        border-left: 4px solid ${bgColor};
        color: var(--text-white);
        padding: 16px 20px;
        border-radius: var(--border-radius);
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 12px;
        transform: translateX(120%);
        transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
    `;
    
    toast.innerHTML = `<i class="fa-solid ${iconClass}" style="color: ${bgColor}; font-size: 1.2rem;"></i> <div>${msg}</div>`;
    container.appendChild(toast);

    requestAnimationFrame(() => requestAnimationFrame(() => toast.style.transform = 'translateX(0)'));
    setTimeout(() => {
        toast.style.transform = 'translateX(120%)';
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}
