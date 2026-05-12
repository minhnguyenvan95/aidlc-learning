// AI-DLC Interactive Walkthrough
// 3 bài toán mẫu, 12 giai đoạn, người dùng phê duyệt từng bước

const scenarios = {
  greenfield: { id:'greenfield', name:'🆕 Xây dựng Todo App từ đầu', short:'Todo App (Greenfield)', desc:'Ứng dụng quản lý công việc với React + Node.js + PostgreSQL. Dự án mới hoàn toàn.', type:'greenfield', complexity:'standard', userFacing:true, multiUnit:true, needsNFR:false, needsInfra:true, needsAppDesign:true },
  brownfield: { id:'brownfield', name:'🔧 Thêm Thanh toán vào E-commerce', short:'Payment (Brownfield)', desc:'Tích hợp Stripe vào hệ thống e-commerce đang chạy. Cần phân tích hệ thống hiện tại.', type:'brownfield', complexity:'comprehensive', userFacing:true, multiUnit:true, needsNFR:true, needsInfra:true, needsAppDesign:true },
  bugfix: { id:'bugfix', name:'🐛 Sửa lỗi API chậm', short:'Bugfix (Đơn giản)', desc:'API /users trả về >3s. Tối ưu query + thêm caching. Thay đổi nhỏ, rõ ràng.', type:'brownfield', complexity:'minimal', userFacing:false, multiUnit:false, needsNFR:false, needsInfra:false, needsAppDesign:false }
};

const steps = [
  {id:'select', title:'Chọn Bài Toán'},
  {id:'workspace-detection', title:'GĐ 1: Phát Hiện Workspace', phase:'inception', always:true},
  {id:'reverse-engineering', title:'GĐ 2: Phân Tích Ngược', phase:'inception'},
  {id:'requirements-analysis', title:'GĐ 3: Phân Tích Yêu Cầu', phase:'inception', always:true},
  {id:'user-stories', title:'GĐ 4: Câu Chuyện Người Dùng', phase:'inception'},
  {id:'workflow-planning', title:'GĐ 5: Lập Kế Hoạch', phase:'inception', always:true},
  {id:'application-design', title:'GĐ 6: Thiết Kế Ứng Dụng', phase:'inception'},
  {id:'units-generation', title:'GĐ 7: Sinh Đơn Vị Công Việc', phase:'inception'},
  {id:'functional-design', title:'GĐ 8: Thiết Kế Chức Năng', phase:'construction'},
  {id:'nfr', title:'GĐ 9: Yêu Cầu Phi Chức Năng', phase:'construction'},
  {id:'infrastructure-design', title:'GĐ 10: Thiết Kế Hạ Tầng', phase:'construction'},
  {id:'code-generation', title:'GĐ 11: Sinh Mã Nguồn', phase:'construction', always:true},
  {id:'build-test', title:'GĐ 12: Xây Dựng & Kiểm Thử', phase:'construction', always:true},
  {id:'operations', title:'GĐ 13: Vận Hành (Operations)', phase:'operations', always:true}
];

let selected = null, idx = 0, decisions = {};


// ==================== IO DATA (theo spec .aidlc/core-workflow.md) ====================
function getIO(id, s) {
  const io = {
    'workspace-detection': {
      inputs: ['Workspace root (quét toàn bộ)', 'aidlc-docs/aidlc-state.md (nếu tồn tại)'],
      outputs: ['aidlc-docs/aidlc-state.md', 'aidlc-docs/audit.md'],
      rules: ['.aidlc/aws-aidlc-rule-details/inception/workspace-detection.md', '.aidlc/aws-aidlc-rule-details/common/process-overview.md', '.aidlc/aws-aidlc-rule-details/common/session-continuity.md']
    },
    'reverse-engineering': {
      inputs: ['Toàn bộ mã nguồn workspace', 'package.json / cấu hình dự án', 'Tệp hạ tầng (CDK/Terraform)'],
      outputs: ['aidlc-docs/inception/reverse-engineering/business-overview.md', 'aidlc-docs/inception/reverse-engineering/architecture.md', 'aidlc-docs/inception/reverse-engineering/code-structure.md', 'aidlc-docs/inception/reverse-engineering/api-documentation.md', 'aidlc-docs/inception/reverse-engineering/component-inventory.md', 'aidlc-docs/inception/reverse-engineering/technology-stack.md', 'aidlc-docs/inception/reverse-engineering/dependencies.md', 'aidlc-docs/audit.md (cập nhật)'],
      rules: ['.aidlc/aws-aidlc-rule-details/inception/reverse-engineering.md', '.aidlc/aws-aidlc-rule-details/common/content-validation.md']
    },
    'requirements-analysis': {
      inputs: ['Yêu cầu người dùng (raw input)', ...(s.type==='brownfield'?['aidlc-docs/inception/reverse-engineering/*.md']:[]), 'extensions/*.opt-in.md'],
      outputs: ['aidlc-docs/inception/requirements/requirement-verification-questions.md', 'aidlc-docs/inception/requirements/requirements.md', 'aidlc-docs/aidlc-state.md (Extension Configuration)', 'aidlc-docs/audit.md (cập nhật)'],
      rules: ['.aidlc/aws-aidlc-rule-details/inception/requirements-analysis.md', '.aidlc/aws-aidlc-rule-details/common/question-format-guide.md', '.aidlc/aws-aidlc-rule-details/common/overconfidence-prevention.md']
    },
    'user-stories': {
      inputs: ['aidlc-docs/inception/requirements/requirements.md', ...(s.type==='brownfield'?['aidlc-docs/inception/reverse-engineering/business-overview.md']:[])],
      outputs: ['aidlc-docs/inception/user-stories/stories.md', 'aidlc-docs/inception/user-stories/personas.md', 'aidlc-docs/inception/plans/user-stories-plan.md', 'aidlc-docs/audit.md (cập nhật)'],
      rules: ['.aidlc/aws-aidlc-rule-details/inception/user-stories.md', '.aidlc/aws-aidlc-rule-details/common/question-format-guide.md']
    },
    'workflow-planning': {
      inputs: ['aidlc-docs/inception/requirements/requirements.md', ...(s.userFacing?['aidlc-docs/inception/user-stories/stories.md']:[]), ...(s.type==='brownfield'?['aidlc-docs/inception/reverse-engineering/*.md']:[]), 'aidlc-docs/aidlc-state.md'],
      outputs: ['aidlc-docs/inception/plans/execution-plan.md', 'aidlc-docs/aidlc-state.md (stages EXECUTE/SKIP)', 'aidlc-docs/audit.md (cập nhật)'],
      rules: ['.aidlc/aws-aidlc-rule-details/inception/workflow-planning.md', '.aidlc/aws-aidlc-rule-details/common/content-validation.md']
    },
    'application-design': {
      inputs: ['aidlc-docs/inception/requirements/requirements.md', ...(s.userFacing?['aidlc-docs/inception/user-stories/stories.md']:[]), ...(s.type==='brownfield'?['aidlc-docs/inception/reverse-engineering/architecture.md']:[])],
      outputs: ['aidlc-docs/inception/application-design/components.md', 'aidlc-docs/inception/application-design/component-methods.md', 'aidlc-docs/inception/application-design/services.md', 'aidlc-docs/inception/application-design/component-dependency.md', 'aidlc-docs/audit.md (cập nhật)'],
      rules: ['.aidlc/aws-aidlc-rule-details/inception/application-design.md']
    },
    'units-generation': {
      inputs: ['aidlc-docs/inception/application-design/components.md', 'aidlc-docs/inception/requirements/requirements.md'],
      outputs: ['aidlc-docs/inception/plans/unit-of-work.md', 'aidlc-docs/inception/plans/unit-of-work-dependency.md', 'aidlc-docs/inception/plans/unit-of-work-story-map.md', 'aidlc-docs/audit.md (cập nhật)'],
      rules: ['.aidlc/aws-aidlc-rule-details/inception/units-generation.md']
    },
    'functional-design': {
      inputs: ['aidlc-docs/inception/plans/unit-of-work.md', 'aidlc-docs/inception/user-stories/stories.md', 'aidlc-docs/inception/requirements/requirements.md'],
      outputs: ['aidlc-docs/construction/{unit}/functional-design/business-logic-model.md', 'aidlc-docs/construction/{unit}/functional-design/business-rules.md', 'aidlc-docs/construction/{unit}/functional-design/domain-entities.md', 'aidlc-docs/construction/plans/functional-design-plan.md', 'aidlc-docs/audit.md (cập nhật)'],
      rules: ['.aidlc/aws-aidlc-rule-details/construction/functional-design.md']
    },
    'nfr': {
      inputs: ['aidlc-docs/construction/{unit}/functional-design/*.md', 'aidlc-docs/inception/requirements/requirements.md'],
      outputs: ['aidlc-docs/construction/{unit}/nfr-requirements/nfr-requirements.md', 'aidlc-docs/construction/{unit}/nfr-requirements/tech-stack-decisions.md', 'aidlc-docs/construction/{unit}/nfr-design/nfr-design-patterns.md', 'aidlc-docs/audit.md (cập nhật)'],
      rules: ['.aidlc/aws-aidlc-rule-details/construction/nfr-requirements.md', '.aidlc/aws-aidlc-rule-details/construction/nfr-design.md']
    },
    'infrastructure-design': {
      inputs: ['aidlc-docs/construction/{unit}/nfr-design/*.md', 'aidlc-docs/construction/{unit}/functional-design/*.md', ...(s.type==='brownfield'?['aidlc-docs/inception/reverse-engineering/architecture.md']:[])],
      outputs: ['aidlc-docs/construction/{unit}/infrastructure-design/infrastructure-design.md', 'aidlc-docs/construction/{unit}/infrastructure-design/deployment-architecture.md', 'aidlc-docs/audit.md (cập nhật)'],
      rules: ['.aidlc/aws-aidlc-rule-details/construction/infrastructure-design.md']
    },
    'code-generation': {
      inputs: ['aidlc-docs/construction/{unit}/functional-design/*.md', ...(s.needsNFR?['aidlc-docs/construction/{unit}/nfr-design/*.md']:[]), ...(s.needsInfra?['aidlc-docs/construction/{unit}/infrastructure-design/*.md']:[]), ...(s.type==='brownfield'?['Mã nguồn hiện có']:[])],
      outputs: ['aidlc-docs/construction/plans/code-generation-plan.md', 'Mã nguồn tại workspace root', 'aidlc-docs/aidlc-state.md (checkbox [x])', 'aidlc-docs/audit.md (cập nhật)'],
      rules: ['.aidlc/aws-aidlc-rule-details/construction/code-generation.md']
    },
    'build-test': {
      inputs: ['Toàn bộ mã nguồn đã sinh', 'aidlc-docs/construction/*/functional-design/*.md'],
      outputs: ['aidlc-docs/construction/build-and-test/build-instructions.md', 'aidlc-docs/construction/build-and-test/unit-test-instructions.md', 'aidlc-docs/construction/build-and-test/integration-test-instructions.md', 'aidlc-docs/construction/build-and-test/performance-test-instructions.md', 'aidlc-docs/construction/build-and-test/build-and-test-summary.md', 'aidlc-docs/audit.md (cập nhật)'],
      rules: ['.aidlc/aws-aidlc-rule-details/construction/build-and-test.md']
    },
    'operations': {
      inputs: ['aidlc-docs/construction/build-and-test/build-and-test-summary.md', 'aidlc-docs/aidlc-state.md'],
      outputs: ['aidlc-docs/operations/ (placeholder — chưa có output cụ thể)'],
      rules: ['.aidlc/aws-aidlc-rule-details/operations/operations.md']
    }
  };
  return io[id]||null;
}


// ==================== STEP DATA (phân tích + options theo kịch bản) ====================
function getData(id, s) {
  if(!s) return null;
  const d = {
    'workspace-detection': {
      analysis: s.type==='brownfield'
        ? (s.id==='bugfix'
          ? 'Quét workspace hoàn tất:<br>• Phát hiện <strong>src/</strong> với 47 tệp TypeScript<br>• <strong>package.json</strong> → Node.js v18, Express 4.18<br>• <strong>prisma/schema.prisma</strong> → PostgreSQL<br>• <strong>docker-compose.yml</strong> → Redis, PostgreSQL<br>• <strong>Kết luận:</strong> Dự án <strong>Brownfield</strong> — hệ thống đang chạy production.'
          : 'Quét workspace hoàn tất:<br>• Phát hiện <strong>12 packages</strong> trong monorepo (Turborepo)<br>• <strong>apps/web</strong> → Next.js 14 storefront<br>• <strong>apps/api</strong> → NestJS backend, 89 endpoints<br>• <strong>packages/db</strong> → Prisma + PostgreSQL<br>• <strong>infra/</strong> → AWS CDK (ECS, RDS, ElastiCache)<br>• <strong>Kết luận:</strong> Dự án <strong>Brownfield</strong> — e-commerce đang phục vụ ~5000 users/ngày.')
        : 'Quét workspace hoàn tất:<br>• Thư mục trống — không có <strong>package.json</strong>, <strong>src/</strong>, hay bất kỳ mã nguồn nào<br>• Không có <strong>.git</strong> history<br>• Không có tệp cấu hình hạ tầng<br>• <strong>Kết luận:</strong> Dự án <strong>Greenfield</strong> — bắt đầu hoàn toàn từ đầu.',
      decision: s.type==='brownfield'
        ? (s.id==='bugfix' ? 'Đề xuất: Chạy Phân Tích Ngược nhanh (focus vào module users + database layer).' : 'Đề xuất: Chạy Phân Tích Ngược toàn diện — hệ thống phức tạp, cần hiểu trước khi thêm Payment.')
        : 'Đề xuất: Bỏ qua Phân Tích Ngược, đi thẳng Phân Tích Yêu Cầu.',
      options: s.type==='brownfield'
        ? (s.id==='bugfix'
          ? [{id:'approve',label:'✅ Đồng ý — Cần xem cấu trúc DB và query hiện tại của /users',t:'approve'},{id:'skip-re',label:'Bỏ qua — Tôi biết rõ endpoint này, chỉ cần thêm index + cache',t:'change'},{id:'partial',label:'Chỉ phân tích module users — không cần toàn bộ hệ thống',t:'change'}]
          : [{id:'approve',label:'✅ Đồng ý — Cần hiểu kiến trúc monorepo trước khi thêm Payment',t:'approve'},{id:'skip-re',label:'Bỏ qua — Team đã có tài liệu kiến trúc rồi',t:'change'},{id:'partial',label:'Chỉ phân tích apps/api và packages/db — không cần frontend',t:'change'}])
        : [{id:'approve',label:'✅ Đồng ý — Đúng Greenfield, không có gì để phân tích',t:'approve'},{id:'has-ref',label:'Có mã tham khảo — Tôi có repo mẫu muốn dựa theo',t:'change'}]
    },
    'reverse-engineering': {
      skip: s.type==='greenfield', skipReason:'Dự án Greenfield — workspace trống, không có mã nguồn để phân tích ngược.',
      analysis: s.id==='bugfix'
        ? 'Phân tích module <strong>/users</strong>:<br>• <strong>Route:</strong> GET /api/users → UsersController.findAll()<br>• <strong>Service:</strong> UsersService gọi Prisma findMany() không có pagination<br>• <strong>Query:</strong> SELECT * FROM users ORDER BY created_at DESC — <strong>full table scan</strong> (không có index trên created_at)<br>• <strong>Bảng users:</strong> 150,000 records, 12 columns<br>• <strong>Không có caching layer</strong> — mỗi request đều query DB<br>• <strong>Response:</strong> Trả về toàn bộ fields kể cả password_hash (security issue)'
        : 'Phân tích hệ thống e-commerce:<br>• <strong>Kiến trúc:</strong> Monorepo Turborepo, 12 packages<br>• <strong>Backend:</strong> NestJS + TypeORM, 89 REST endpoints<br>• <strong>Frontend:</strong> Next.js 14 App Router, 34 pages<br>• <strong>Database:</strong> PostgreSQL 15, 28 tables, quan hệ phức tạp<br>• <strong>Auth:</strong> JWT + refresh token, role-based (admin/customer)<br>• <strong>Hiện tại KHÔNG có module Payment</strong> — orders chỉ có status "pending"<br>• <strong>Infra:</strong> ECS Fargate, RDS, ElastiCache, CloudFront',
      decision: s.id==='bugfix' ? 'Đề xuất: Tập trung vào UsersService, Prisma schema, và thiếu caching.' : 'Đề xuất: Tạo 7 tài liệu phân tích. Đặc biệt chú ý: orders table cần thêm payment_id FK.',
      artifacts:['business-overview.md','architecture.md','code-structure.md','api-documentation.md','component-inventory.md','technology-stack.md','dependencies.md'],
      options: s.id==='bugfix'
        ? [{id:'approve',label:'✅ Phê duyệt — Đã xác định rõ: full scan + no cache + no pagination',t:'approve'},{id:'deeper',label:'Phân tích thêm — Kiểm tra xem có N+1 query không',t:'change'},{id:'security',label:'Cần fix luôn — Response đang leak password_hash',t:'change'}]
        : [{id:'approve',label:'✅ Phê duyệt — Hiểu rõ kiến trúc, sẵn sàng thiết kế Payment',t:'approve'},{id:'deeper',label:'Phân tích thêm — Cần xem chi tiết orders table schema',t:'change'},{id:'concern',label:'Có vấn đề — TypeORM khó tích hợp với Stripe, cần đánh giá',t:'change'}]
    },
    'requirements-analysis': {
      analysis: s.id==='bugfix'
        ? 'Phân tích yêu cầu:<br>• <strong>Vấn đề:</strong> GET /api/users mất >3 giây (SLA yêu cầu <500ms)<br>• <strong>Nguyên nhân sơ bộ:</strong> Full table scan 150K records + không cache<br>• <strong>Phạm vi:</strong> 1 endpoint, 1 service, 1 table<br>• <strong>Rủi ro:</strong> Thấp — thay đổi cô lập, không ảnh hưởng logic nghiệp vụ<br>• <strong>Độ sâu:</strong> <span class="depth minimal">TỐI THIỂU</span>'
        : s.id==='greenfield'
        ? 'Phân tích yêu cầu:<br>• <strong>Mục tiêu:</strong> Ứng dụng Todo cho cá nhân, web-based<br>• <strong>Tính năng chính:</strong> CRUD todos, đánh dấu hoàn thành, lọc, tìm kiếm<br>• <strong>Người dùng:</strong> 1 persona (cá nhân), cần đăng nhập<br>• <strong>Phạm vi:</strong> Full-stack (Frontend + Backend + DB)<br>• <strong>Rủi ro:</strong> Trung bình — nhiều thành phần nhưng logic đơn giản<br>• <strong>Độ sâu:</strong> <span class="depth standard">TIÊU CHUẨN</span>'
        : 'Phân tích yêu cầu:<br>• <strong>Mục tiêu:</strong> Tích hợp thanh toán Stripe vào e-commerce đang chạy<br>• <strong>Tính năng:</strong> Checkout, xử lý thanh toán, webhook, hoàn tiền, lịch sử<br>• <strong>Người dùng:</strong> 3 personas (khách hàng, quản trị viên, kế toán)<br>• <strong>Phạm vi:</strong> Backend + Frontend + Infrastructure + Security<br>• <strong>Rủi ro:</strong> <strong>CAO</strong> — liên quan tiền thật, PCI-DSS, dữ liệu nhạy cảm<br>• <strong>Độ sâu:</strong> <span class="depth comprehensive">TOÀN DIỆN</span>',
      questions: s.id==='bugfix'
        ? [{q:'Endpoint nào bị chậm?',opts:['GET /api/users','GET /api/users/:id','POST /api/users','Tất cả /users endpoints']},{q:'Thời gian phản hồi mục tiêu?',opts:['< 200ms','< 500ms','< 1 giây','< 2 giây']},{q:'Có được thay đổi response format?',opts:['Có, thoải mái','Chỉ thêm, không bỏ fields','Phải backward-compatible 100%']},{q:'Redis đã có trong stack?',opts:['Có, đang dùng cho session','Có trong docker-compose nhưng chưa dùng','Chưa có, cần thêm']},{q:'Client nào đang gọi endpoint này?',opts:['Admin dashboard (web)','Mobile app','Cả hai','Không rõ, cần kiểm tra']}]
        : s.id==='greenfield'
        ? [{q:'Số người dùng đồng thời dự kiến?',opts:['< 10 (cá nhân)','10-100 (nhóm nhỏ)','100-1000 (startup)','> 1000']},{q:'Xác thực bằng gì?',opts:['Email + password','Google OAuth','Cả hai','Không cần (public)']},{q:'Todo cần fields nào?',opts:['Chỉ title + completed','Thêm priority','Thêm due date','Thêm tags','Tất cả']},{q:'Cần real-time sync?',opts:['Không, refresh manual','Giữa các tab','Giữa các thiết bị']},{q:'Deploy ở đâu?',opts:['AWS (ECS)','Vercel/Netlify','Docker self-hosted','Chưa quyết định']}]
        : [{q:'Cổng thanh toán?',opts:['Stripe only','Stripe + PayPal','VNPay','Multi-gateway']},{q:'Loại tiền tệ?',opts:['USD only','USD + EUR','Multi-currency (10+)','VND only']},{q:'Recurring payments?',opts:['Không, one-time only','Monthly subscription','Monthly + yearly','Chưa chắc']},{q:'Xử lý hoàn tiền?',opts:['Tự động < 24h','Admin approve','Partial refund OK','Không hỗ trợ']},{q:'PCI-DSS level?',opts:['SAQ-A (hosted form)','SAQ-A-EP (JS SDK)','SAQ-D (full)','Cần tư vấn']},{q:'3D Secure cho EU?',opts:['Có, bắt buộc','Không, chỉ US/VN','Để Stripe quyết định']}],
      decision: s.id==='bugfix' ? 'Đề xuất: Độ sâu <strong>TỐI THIỂU</strong> — vấn đề rõ ràng, giải pháp cô lập.' : s.id==='greenfield' ? 'Đề xuất: Độ sâu <strong>TIÊU CHUẨN</strong> — nhiều thành phần nhưng logic không phức tạp.' : 'Đề xuất: Độ sâu <strong>TOÀN DIỆN</strong> — rủi ro cao, nhiều bên liên quan, cần phân tích kỹ.',
      options: s.id==='bugfix'
        ? [{id:'approve',label:'✅ Đồng ý Tối thiểu — Vấn đề rõ: index + cache + pagination là đủ',t:'approve'},{id:'deeper',label:'Nâng lên Tiêu chuẩn — Cần xem xét cả security issue (leak password_hash)',t:'change'},{id:'scope',label:'Mở rộng phạm vi — Kiểm tra thêm các endpoint khác có cùng vấn đề',t:'change'}]
        : s.id==='greenfield'
        ? [{id:'approve',label:'✅ Đồng ý Tiêu chuẩn — Đủ cho Todo App cá nhân',t:'approve'},{id:'simpler',label:'Giảm xuống Tối thiểu — Chỉ cần CRUD cơ bản, không auth',t:'change'},{id:'deeper',label:'Nâng lên Toàn diện — Muốn multi-user, sharing, collaboration',t:'change'}]
        : [{id:'approve',label:'✅ Đồng ý Toàn diện — Thanh toán cần phân tích kỹ mọi khía cạnh',t:'approve'},{id:'simpler',label:'Giảm xuống Tiêu chuẩn — Phase 1 chỉ cần Stripe basic, không recurring',t:'change'},{id:'split',label:'Chia phase — Phase 1: card payment, Phase 2: refund + subscription',t:'change'}]
    },
    'user-stories': {
      skip:!s.userFacing, skipReason:'Không có thay đổi hướng người dùng — endpoint /users là internal API, chỉ admin dashboard gọi. Tối ưu hiệu năng không thay đổi UX.',
      analysis: s.id==='greenfield'
        ? 'Đánh giá: <strong>Ưu tiên CAO</strong> — tính năng mới hoàn toàn cho người dùng cuối.<br>• 1 persona chính: Người dùng cá nhân<br>• 5 luồng tương tác: tạo, sửa, xóa, hoàn thành, lọc<br>• Cần acceptance criteria rõ ràng cho mỗi luồng'
        : 'Đánh giá: <strong>Ưu tiên CAO</strong> — luồng thanh toán ảnh hưởng trực tiếp doanh thu.<br>• 3 personas: Khách hàng, Quản trị viên, Kế toán<br>• Luồng critical: checkout → payment → confirmation<br>• Cần xử lý edge cases: thẻ bị từ chối, timeout, double-charge',
      stories: s.id==='greenfield'
        ? ['Là người dùng, tôi muốn tạo todo mới bằng cách nhập title và nhấn Enter, để nhanh chóng ghi lại việc cần làm','Là người dùng, tôi muốn click checkbox để đánh dấu hoàn thành, và thấy todo bị gạch ngang ngay lập tức','Là người dùng, tôi muốn lọc "Tất cả / Đang làm / Hoàn thành" để tập trung vào việc chưa xong','Là người dùng, tôi muốn xóa todo bằng nút X, với xác nhận nếu todo chưa hoàn thành','Là người dùng mới, tôi muốn đăng ký bằng email/password để dữ liệu được lưu an toàn']
        : ['Là khách hàng, tôi muốn nhập thông tin thẻ tại trang checkout và thấy xác nhận thanh toán trong <3 giây','Là khách hàng, tôi muốn nhận email xác nhận với mã đơn hàng ngay sau khi thanh toán thành công','Là khách hàng, tôi muốn xem lịch sử thanh toán với trạng thái (thành công/thất bại/hoàn tiền) trong trang tài khoản','Là quản trị viên, tôi muốn xem dashboard doanh thu theo ngày/tuần/tháng với biểu đồ','Là quản trị viên, tôi muốn thực hiện hoàn tiền cho đơn hàng cụ thể với lý do bắt buộc','Là kế toán, tôi muốn xuất báo cáo giao dịch theo khoảng thời gian dạng CSV'],
      options: s.id==='greenfield'
        ? [{id:'approve',label:'✅ Đồng ý — 5 stories phủ đủ CRUD + auth cho Todo',t:'approve'},{id:'add',label:'Thêm — Cần story cho drag-drop sắp xếp thứ tự',t:'change'},{id:'remove',label:'Bớt — Chưa cần auth ở phase 1, bỏ story đăng ký',t:'change'}]
        : [{id:'approve',label:'✅ Đồng ý — 6 stories phủ 3 personas, đủ cho Phase 1',t:'approve'},{id:'add',label:'Thêm — Cần story cho subscription/recurring payment',t:'change'},{id:'modify',label:'Sửa — Story hoàn tiền cần thêm: partial refund, deadline 30 ngày',t:'change'}]
    },
    'workflow-planning': {
      analysis:'Dựa trên phân tích, đề xuất kế hoạch thực thi:',
      plan:[
        {stage:'Thiết Kế Ứng Dụng',dec:s.needsAppDesign?'THỰC THI':'BỎ QUA',why:s.needsAppDesign?'Cần thành phần mới':'Không cần thành phần mới'},
        {stage:'Sinh Đơn Vị Công Việc',dec:s.multiUnit?'THỰC THI':'BỎ QUA',why:s.multiUnit?'Nhiều đơn vị cần phân chia':'Chỉ 1 đơn vị'},
        {stage:'Thiết Kế Chức Năng',dec:s.complexity!=='minimal'?'THỰC THI':'BỎ QUA',why:s.complexity!=='minimal'?'Cần thiết kế logic nghiệp vụ':'Thay đổi đơn giản'},
        {stage:'Yêu Cầu Phi Chức Năng',dec:s.needsNFR?'THỰC THI':'BỎ QUA',why:s.needsNFR?'Có yêu cầu bảo mật/hiệu năng':'Không có NFR đặc biệt'},
        {stage:'Thiết Kế Hạ Tầng',dec:s.needsInfra?'THỰC THI':'BỎ QUA',why:s.needsInfra?'Cần tài nguyên hạ tầng mới':'Không thay đổi hạ tầng'},
        {stage:'Sinh Mã Nguồn',dec:'THỰC THI',why:'Luôn thực thi'},
        {stage:'Xây Dựng & Kiểm Thử',dec:'THỰC THI',why:'Luôn thực thi'}
      ],
      options:[{id:'approve',label:'✅ Đồng ý kế hoạch — Phù hợp cho '+s.short,t:'approve'},{id:'add',label:'Thêm giai đoạn bị bỏ qua',t:'change'},{id:'remove',label:'Bớt giai đoạn không cần',t:'change'}]
    },
    'application-design': {
      skip:!s.needsAppDesign, skipReason:'Không cần thành phần mới — thay đổi trong phạm vi hiện có.',
      analysis: s.id==='greenfield'?'Đề xuất kiến trúc:<br>• <strong>Frontend:</strong> React + TypeScript<br>• <strong>Backend:</strong> Node.js + Express + Prisma<br>• <strong>Database:</strong> PostgreSQL<br>• <strong>Components:</strong> TodoList, TodoItem, TodoForm, AuthProvider':'Thành phần mới:<br>• <strong>PaymentService:</strong> Logic thanh toán<br>• <strong>StripeAdapter:</strong> Tích hợp Stripe API<br>• <strong>PaymentController:</strong> API endpoints<br>• <strong>PaymentRepository:</strong> Lưu trữ giao dịch',
      options: s.id==='greenfield'?[{id:'approve',label:'✅ Đồng ý — React + Node + PostgreSQL phù hợp',t:'approve'},{id:'change',label:'Đổi tech stack (Vue, Go, MongoDB...)',t:'change'}]:[{id:'approve',label:'✅ Đồng ý — Tách biệt rõ trách nhiệm',t:'approve'},{id:'change',label:'Cần thêm/bớt thành phần',t:'change'}]
    },
    'units-generation': {
      skip:!s.multiUnit, skipReason:'Chỉ 1 đơn vị công việc — không cần phân chia.',
      analysis: s.id==='greenfield'?'Phân chia thành <strong>3 đơn vị</strong>:':'Phân chia thành <strong>4 đơn vị</strong>:',
      units: s.id==='greenfield'?[{n:'Unit 1: Backend API',d:'REST API CRUD Todo, xác thực JWT'},{n:'Unit 2: Database',d:'Schema PostgreSQL, Prisma models, migrations'},{n:'Unit 3: Frontend',d:'Giao diện React components'}]:[{n:'Unit 1: Payment Domain',d:'Entities, business rules thanh toán'},{n:'Unit 2: Stripe Integration',d:'Adapter pattern cho Stripe API'},{n:'Unit 3: Payment API',d:'REST endpoints, validation'},{n:'Unit 4: Payment UI',d:'Checkout form, history'}],
      options: s.id==='greenfield'?[{id:'approve',label:'✅ Đồng ý — 3 đơn vị hợp lý',t:'approve'},{id:'merge',label:'Gộp — Backend + DB nên chung',t:'change'}]:[{id:'approve',label:'✅ Đồng ý — 4 đơn vị rõ trách nhiệm',t:'approve'},{id:'split',label:'Tách — UI cần chia Checkout và History',t:'change'}]
    },
    'functional-design': {
      skip:s.complexity==='minimal', skipReason:'Độ phức tạp Tối thiểu — vấn đề đã rõ (thêm index + cache + pagination), không cần thiết kế chức năng chi tiết.',
      analysis: s.id==='greenfield'
        ? 'Thiết kế chức năng <strong>Unit 1: Backend API</strong>:<br><br><strong>Entities:</strong><br>• User {id, email, passwordHash, name, createdAt}<br>• Todo {id, title, completed, userId, createdAt, updatedAt}<br><br><strong>Business Rules:</strong><br>• Title: bắt buộc, 1-200 ký tự, trim whitespace<br>• User isolation: user chỉ CRUD todo của mình (WHERE userId = currentUser.id)<br>• Soft delete: todo bị xóa vẫn giữ 30 ngày trong DB<br>• Ordering: mặc định theo createdAt DESC<br><br><strong>API Endpoints:</strong><br>• POST /todos — tạo mới (validate title)<br>• GET /todos?status=all|active|completed — danh sách có filter<br>• PATCH /todos/:id — cập nhật title hoặc completed<br>• DELETE /todos/:id — soft delete'
        : 'Thiết kế chức năng <strong>Unit 1: Payment Domain</strong>:<br><br><strong>Entities:</strong><br>• Payment {id, orderId, amount, currency, status, stripePaymentIntentId, idempotencyKey, createdAt, updatedAt}<br>• PaymentEvent {id, paymentId, type, data, createdAt} — event sourcing<br><br><strong>State Machine:</strong><br>• created → pending → processing → succeeded | failed<br>• succeeded → refund_requested → refunded | refund_failed<br>• Transitions chỉ hợp lệ theo thứ tự (không thể skip)<br><br><strong>Business Rules:</strong><br>• Amount > 0, max 999,999.99<br>• Currency: chỉ USD, EUR, VND (whitelist)<br>• Idempotency key: bắt buộc, unique per merchant, TTL 24h<br>• Double-charge prevention: check idempotency trước khi gọi Stripe<br>• Refund: chỉ trong 30 ngày, amount ≤ original amount',
      options: s.id==='greenfield'
        ? [{id:'approve',label:'✅ Đồng ý — Entities, rules, endpoints rõ ràng cho Todo',t:'approve'},{id:'add-field',label:'Thêm fields — Cần priority (low/medium/high) và dueDate',t:'change'},{id:'change-delete',label:'Đổi — Muốn hard delete thay vì soft delete',t:'change'}]
        : [{id:'approve',label:'✅ Đồng ý — State machine + idempotency + event sourcing chặt chẽ',t:'approve'},{id:'add-state',label:'Thêm trạng thái — Cần "disputed" cho chargeback từ ngân hàng',t:'change'},{id:'change-refund',label:'Sửa refund — Cần hỗ trợ partial refund (hoàn một phần)',t:'change'}]
    },
    'nfr': {
      skip:!s.needsNFR, skipReason:'Không có yêu cầu phi chức năng đặc biệt.',
      analysis:'NFR cho hệ thống thanh toán:<br>• <strong>Bảo mật:</strong> PCI-DSS, mã hóa dữ liệu thẻ, không lưu CVV<br>• <strong>Hiệu năng:</strong> < 3 giây, 99.9% uptime<br>• <strong>Mở rộng:</strong> 1000 giao dịch/phút<br>• <strong>Giám sát:</strong> Alert khi lỗi > 1%',
      options:[{id:'approve',label:'✅ Đồng ý — PCI-DSS + 99.9% uptime bắt buộc',t:'approve'},{id:'relax',label:'Nới lỏng — 99.5% đủ cho giai đoạn đầu',t:'change'}]
    },
    'infrastructure-design': {
      skip:!s.needsInfra, skipReason:'Không thay đổi hạ tầng.',
      analysis: s.id==='greenfield'?'Hạ tầng Todo App:<br>• <strong>Compute:</strong> ECS Fargate<br>• <strong>Database:</strong> RDS PostgreSQL<br>• <strong>CDN:</strong> CloudFront<br>• <strong>CI/CD:</strong> GitHub Actions → ECR → ECS':'Hạ tầng bổ sung Payment:<br>• <strong>Queue:</strong> SQS cho webhook bất đồng bộ<br>• <strong>Secrets:</strong> AWS Secrets Manager<br>• <strong>Monitoring:</strong> CloudWatch Alarms<br>• <strong>WAF:</strong> Rate limiting',
      options: s.id==='greenfield'?[{id:'approve',label:'✅ Đồng ý — ECS + RDS phù hợp',t:'approve'},{id:'change',label:'Đổi — Muốn Vercel/Railway đơn giản hơn',t:'change'}]:[{id:'approve',label:'✅ Đồng ý — SQS + WAF đủ cho Payment',t:'approve'},{id:'change',label:'Thêm DLQ cho xử lý lỗi webhook',t:'change'}]
    },
    'code-generation': {
      analysis: s.id==='bugfix'
        ? 'Kế hoạch sinh mã (1 đơn vị duy nhất):<br><br><strong>[ ] Bước 1:</strong> Tạo migration thêm index<br><code>CREATE INDEX idx_users_created_at ON users(created_at DESC);</code><br><code>CREATE INDEX idx_users_email ON users(email);</code><br><br><strong>[ ] Bước 2:</strong> Thêm Redis caching layer<br>• Tạo <code>src/cache/redis.service.ts</code><br>• Cache key: <code>users:list:{page}:{limit}</code>, TTL: 60s<br>• Invalidate khi user CRUD<br><br><strong>[ ] Bước 3:</strong> Refactor UsersService<br>• Thêm pagination: <code>findAll(page, limit)</code><br>• Select chỉ fields cần thiết (BỎ password_hash)<br>• Check cache trước, fallback DB<br><br><strong>[ ] Bước 4:</strong> Cập nhật UsersController<br>• Thêm query params: <code>?page=1&limit=20</code><br>• Response format: <code>{data: [...], meta: {total, page, pages}}</code>'
        : s.id==='greenfield'
        ? 'Kế hoạch sinh mã (Unit 1: Backend API):<br><br><strong>[ ] Bước 1:</strong> Khởi tạo project<br>• <code>npm init</code>, cài Express, TypeScript, Prisma, Jest<br>• Cấu trúc: <code>src/{controllers,services,middleware,types}/</code><br><br><strong>[ ] Bước 2:</strong> Prisma schema + migration<br>• Model User (id, email, passwordHash, name, createdAt)<br>• Model Todo (id, title, completed, userId FK, timestamps)<br>• <code>npx prisma migrate dev</code><br><br><strong>[ ] Bước 3:</strong> TodoService<br>• <code>create(userId, title)</code> — validate + save<br>• <code>findAll(userId, filter)</code> — pagination + filter<br>• <code>update(userId, todoId, data)</code> — ownership check<br>• <code>delete(userId, todoId)</code> — soft delete<br><br><strong>[ ] Bước 4:</strong> TodoController (REST)<br>• Route mounting, request validation (zod)<br>• Error handling middleware<br><br><strong>[ ] Bước 5:</strong> AuthMiddleware<br>• JWT verify, extract userId, attach to req<br>• Login/Register endpoints<br><br><strong>[ ] Bước 6:</strong> Unit tests<br>• TodoService: mock Prisma, test CRUD + validation<br>• AuthMiddleware: mock JWT, test valid/invalid/expired'
        : 'Kế hoạch sinh mã (Unit 1: Payment Domain):<br><br><strong>[ ] Bước 1:</strong> Payment Entity + Value Objects<br>• <code>src/payment/domain/Payment.ts</code> — entity với private state<br>• <code>Money.ts</code> — value object (amount + currency)<br>• <code>PaymentStatus.ts</code> — enum với allowed transitions<br><br><strong>[ ] Bước 2:</strong> PaymentStateMachine<br>• <code>transition(from, event) → to</code><br>• Throw <code>InvalidTransitionError</code> nếu không hợp lệ<br>• Log mọi transition vào PaymentEvent<br><br><strong>[ ] Bước 3:</strong> Business Rules<br>• <code>PaymentValidator.ts</code> — validate amount, currency, idempotency<br>• <code>RefundPolicy.ts</code> — check 30-day window, max amount<br>• <code>DuplicatePaymentGuard.ts</code> — idempotency check<br><br><strong>[ ] Bước 4:</strong> Repository Interface<br>• <code>IPaymentRepository.ts</code> — findById, save, findByIdempotencyKey<br>• <code>IPaymentEventRepository.ts</code> — append, findByPaymentId<br><br><strong>[ ] Bước 5:</strong> PaymentService<br>• <code>createPayment(orderId, amount, currency, idempotencyKey)</code><br>• <code>processPayment(paymentId)</code> — orchestrate Stripe call<br>• <code>handleWebhook(event)</code> — update state from Stripe<br>• <code>requestRefund(paymentId, amount, reason)</code><br><br><strong>[ ] Bước 6:</strong> Unit Tests<br>• StateMachine: test all valid/invalid transitions<br>• Validator: edge cases (0 amount, unknown currency)<br>• RefundPolicy: within/outside 30 days, partial amounts<br>• Service: mock repository + Stripe adapter',
      options: s.id==='bugfix'
        ? [{id:'approve',label:'✅ Đồng ý — 4 bước rõ ràng: index → cache → service → controller',t:'approve'},{id:'reorder',label:'Đổi thứ tự — Nên fix security (bỏ password_hash) trước, rồi mới optimize',t:'change'},{id:'add-step',label:'Thêm bước — Cần thêm monitoring/alerting cho cache hit rate',t:'change'}]
        : s.id==='greenfield'
        ? [{id:'approve',label:'✅ Đồng ý — 6 bước bottom-up: schema → service → controller → auth → test',t:'approve'},{id:'tdd',label:'Đổi sang TDD — Viết test trước (bước 6 lên đầu)',t:'change'},{id:'skip-auth',label:'Bỏ auth — Phase 1 chưa cần đăng nhập, thêm sau',t:'change'}]
        : [{id:'approve',label:'✅ Đồng ý — Domain-first: entity → state machine → rules → service',t:'approve'},{id:'add-step',label:'Thêm bước — Cần integration test với Stripe sandbox ngay trong unit này',t:'change'},{id:'change-order',label:'Đổi — Repository implementation trước Service (cần persistence sớm)',t:'change'}]
    },
    'build-test': {
      analysis: s.id==='bugfix'
        ? 'Hướng dẫn kiểm thử cho tối ưu /users:<br><br><strong>Unit Tests:</strong><br>• Test cache service: set/get/invalidate, TTL expiry<br>• Test UsersService: pagination logic, field selection<br>• Test response format: meta object, no password_hash<br><br><strong>Integration Tests:</strong><br>• GET /api/users?page=1&limit=20 → 200, đúng format<br>• GET /api/users?page=999 → 200, data: [] (empty page)<br>• Verify cache hit: request 2 lần, DB chỉ query 1 lần<br>• Verify cache invalidate: POST /users → GET /users trả về user mới<br><br><strong>Performance Benchmark:</strong><br>• Trước: measure current response time (expect >3s)<br>• Sau: measure với index + cache (target <500ms)<br>• Load test: 100 concurrent requests → p95 < 800ms'
        : s.id==='greenfield'
        ? 'Hướng dẫn kiểm thử cho Todo App Backend:<br><br><strong>Unit Tests (Jest):</strong><br>• TodoService.create: valid title, empty title, too long title<br>• TodoService.findAll: filter active/completed, pagination<br>• TodoService.update: ownership check, partial update<br>• TodoService.delete: soft delete, already deleted<br>• AuthMiddleware: valid JWT, expired JWT, missing header<br><br><strong>Integration Tests (Supertest):</strong><br>• Full CRUD flow: create → read → update → delete<br>• Auth flow: register → login → access protected route<br>• Isolation: user A cannot see user B todos<br>• Pagination: 25 todos, page=2&limit=10 → 10 items<br><br><strong>E2E Tests (nếu có frontend):</strong><br>• Luồng hoàn chỉnh: đăng nhập → tạo todo → check → filter → xóa'
        : 'Hướng dẫn kiểm thử cho Payment System:<br><br><strong>Unit Tests:</strong><br>• PaymentStateMachine: 8 valid transitions, 12 invalid transitions<br>• PaymentValidator: amount=0, amount=-1, unknown currency, missing idempotency<br>• RefundPolicy: within 30 days, day 31, partial > original<br>• DuplicatePaymentGuard: same key → return existing, different key → proceed<br><br><strong>Integration Tests (Stripe Sandbox):</strong><br>• Create PaymentIntent → confirm → webhook succeeded<br>• Create PaymentIntent → card declined → webhook failed<br>• Refund: full refund, partial refund, refund after 30 days (reject)<br>• Webhook: replay attack (duplicate event ID → ignore)<br>• Idempotency: same request 2x → same payment, charged once<br><br><strong>Contract Tests:</strong><br>• POST /payments request schema matches frontend expectations<br>• Webhook payload matches Stripe documentation<br><br><strong>Security Tests:</strong><br>• No card numbers in logs or responses<br>• Stripe secret key not exposed in client bundle<br>• Rate limiting: >10 payment attempts/minute → 429',
      options: s.id==='bugfix'
        ? [{id:'approve',label:'✅ Hoàn tất — Unit + Integration + Benchmark đủ xác nhận fix',t:'approve'},{id:'add-load',label:'Thêm — Cần sustained load test (10 phút liên tục) cho production confidence',t:'change'},{id:'add-regression',label:'Thêm — Cần regression test đảm bảo không break existing filters',t:'change'}]
        : s.id==='greenfield'
        ? [{id:'approve',label:'✅ Hoàn tất — Unit + Integration + E2E phủ đủ cho Todo App',t:'approve'},{id:'add-a11y',label:'Thêm — Cần accessibility test (screen reader, keyboard navigation)',t:'change'},{id:'add-perf',label:'Thêm — Cần performance test: 1000 todos render time < 2s',t:'change'}]
        : [{id:'approve',label:'✅ Hoàn tất — Unit + Integration + Contract + Security đủ cho Payment',t:'approve'},{id:'add-chaos',label:'Thêm — Cần chaos test: Stripe timeout, DB down, Redis unavailable',t:'change'},{id:'add-pci',label:'Thêm — Cần PCI-DSS audit checklist verification',t:'change'}]
    },
    'operations': {
      placeholder: true,
      analysis: s.id==='bugfix'
        ? '🟡 <strong>Pha Vận Hành</strong> — Kế hoạch sau khi deploy fix hiệu năng /users:<br><br>Thay đổi nhỏ nhưng ảnh hưởng endpoint được gọi <strong>~2000 lần/ngày</strong>. Cần giám sát chặt 48h đầu để đảm bảo fix ổn định và không gây regression.'
        : s.id==='greenfield'
        ? '🟡 <strong>Pha Vận Hành</strong> — Kế hoạch go-live cho Todo App:<br><br>Ứng dụng mới hoàn toàn, cần thiết lập toàn bộ pipeline từ đầu: CI/CD, monitoring, domain, SSL. Mục tiêu: <strong>go-live trong 1 tuần</strong> sau khi code hoàn tất.'
        : '🟡 <strong>Pha Vận Hành</strong> — Kế hoạch triển khai Payment lên production:<br><br>Tính năng thanh toán liên quan <strong>tiền thật</strong> — cần quy trình triển khai nghiêm ngặt: canary deployment, feature flag, PCI audit, và monitoring 24/7 trong tuần đầu.',
      opsSections: s.id==='bugfix' ? [
        {icon:'🚀', title:'Triển khai (Deployment)', items:[
          'Deploy qua PR merge → CI chạy tests → auto-deploy staging',
          'Verify trên staging: response time < 500ms với 150K records',
          'Deploy production trong giờ thấp điểm (2-4 AM)',
          'Rollback plan: revert migration (DROP INDEX) nếu có vấn đề'
        ]},
        {icon:'📊', title:'Giám sát (Monitoring)', items:[
          'Dashboard: p50, p95, p99 response time cho GET /api/users',
          'Alert: response time p95 > 800ms → Slack #backend-alerts',
          'Alert: Redis cache hit rate < 80% → kiểm tra invalidation logic',
          'Log: slow queries > 200ms vẫn ghi vào CloudWatch'
        ]},
        {icon:'🚨', title:'Ứng phó Sự cố (Incident Response)', items:[
          'Nếu response time tăng lại > 2s: rollback index migration',
          'Nếu Redis down: circuit breaker tự fallback về DB (đã có trong code)',
          'Nếu cache stale: manual invalidate qua admin endpoint /cache/flush',
          'Escalation: > 5 phút downtime → page on-call engineer'
        ]},
        {icon:'🔧', title:'Bảo trì (Maintenance)', items:[
          'Tuần 1: review slow query logs, xác nhận không có query mới bị chậm',
          'Tháng 1: đánh giá cache hit rate, điều chỉnh TTL nếu cần',
          'Quarterly: review bảng users growth, cân nhắc thêm index nếu > 500K records',
          'Xóa password_hash khỏi response đã fix — verify không client nào dùng field này'
        ]},
        {icon:'✅', title:'Checklist Sẵn sàng', items:[
          '☐ Migration đã test trên staging với data production-like',
          '☐ Redis connection pool configured (max 20 connections)',
          '☐ Rollback script đã viết và test',
          '☐ Dashboard monitoring đã tạo',
          '☐ Team đã được thông báo về thay đổi'
        ]}
      ] : s.id==='greenfield' ? [
        {icon:'🚀', title:'Triển khai (Deployment)', items:[
          'Thiết lập GitHub Actions: lint → test → build → push ECR → deploy ECS',
          'Environments: staging (auto-deploy từ main) + production (manual approve)',
          'Database: RDS PostgreSQL với automated backups (7 ngày retention)',
          'Domain: todo-app.example.com → CloudFront → ECS',
          'SSL: ACM certificate auto-renew'
        ]},
        {icon:'📊', title:'Giám sát (Monitoring)', items:[
          'Health check: GET /health → 200 (kiểm tra DB connection)',
          'Metrics: request count, error rate, response time (CloudWatch)',
          'Logs: structured JSON logs → CloudWatch Logs → query với Insights',
          'Uptime: external ping mỗi 60s (UptimeRobot hoặc tương đương)',
          'Alert: error rate > 5% trong 5 phút → email + Slack'
        ]},
        {icon:'🚨', title:'Ứng phó Sự cố (Incident Response)', items:[
          'Severity 1 (app down): restart ECS tasks, check RDS connectivity',
          'Severity 2 (chậm): check DB connections, review slow queries',
          'Severity 3 (lỗi cá biệt): check logs, reproduce, hotfix nếu cần',
          'Post-mortem: viết sau mỗi Sev1/Sev2, chia sẻ với team trong 48h',
          'Runbook: document các bước xử lý phổ biến trong wiki'
        ]},
        {icon:'🔧', title:'Bảo trì (Maintenance)', items:[
          'Dependencies: Renovate bot auto-create PR cho security updates',
          'Database: weekly VACUUM ANALYZE, monitor table bloat',
          'Backups: test restore từ backup mỗi tháng',
          'Performance: review response time trends monthly',
          'Tech debt: allocate 20% sprint cho refactoring/upgrades'
        ]},
        {icon:'✅', title:'Checklist Sẵn sàng Production', items:[
          '☐ CI/CD pipeline green trên staging',
          '☐ Load test: 100 concurrent users, p95 < 1s',
          '☐ Security: OWASP top 10 basic check',
          '☐ Backup & restore đã test',
          '☐ Monitoring dashboard + alerts configured',
          '☐ Domain + SSL configured',
          '☐ README với hướng dẫn deploy cho team mới'
        ]}
      ] : [
        {icon:'🚀', title:'Triển khai (Deployment)', items:[
          'Feature flag: payment_enabled = false (bật dần theo % users)',
          'Canary deployment: 5% traffic → monitor 2h → 25% → 50% → 100%',
          'Database migration: thêm payments table, payment_events table (non-breaking)',
          'Stripe webhook endpoint: register trong Stripe Dashboard trước khi deploy',
          'Rollback: feature flag OFF ngay lập tức nếu có vấn đề, không cần redeploy'
        ]},
        {icon:'📊', title:'Giám sát (Monitoring)', items:[
          'Dashboard Payment: success rate, avg processing time, revenue/hour',
          'Stripe webhook: delivery rate, retry count, failed events',
          'Alert Sev1: payment success rate < 95% trong 10 phút',
          'Alert Sev2: avg processing time > 5s',
          'Alert Sev3: refund rate > 10% trong 1 ngày (có thể fraud)',
          'PCI audit log: mọi access vào payment data được ghi lại'
        ]},
        {icon:'🚨', title:'Ứng phó Sự cố (Incident Response)', items:[
          'Stripe outage: hiển thị "Thanh toán tạm thời không khả dụng", queue orders',
          'Double charge detected: auto-refund duplicate, alert team, investigate',
          'Webhook backlog > 1000: scale SQS consumers, check processing bottleneck',
          'Data breach suspicion: immediately disable payment, notify security team, PCI incident procedure',
          'Escalation matrix: Sev1 → CTO + Security Lead trong 15 phút'
        ]},
        {icon:'🔧', title:'Bảo trì (Maintenance)', items:[
          'Stripe API version: upgrade mỗi 6 tháng (test trên sandbox trước)',
          'PCI-DSS: quarterly vulnerability scan (ASV), annual SAQ submission',
          'Key rotation: Stripe API keys rotate mỗi 90 ngày',
          'Data retention: payment records giữ 7 năm (legal requirement)',
          'Reconciliation: daily job so sánh Stripe records vs local DB'
        ]},
        {icon:'✅', title:'Checklist Sẵn sàng Production', items:[
          '☐ PCI-DSS SAQ-A completed và submitted',
          '☐ Stripe production keys configured (KHÔNG dùng test keys)',
          '☐ Webhook signature verification enabled',
          '☐ Rate limiting: max 10 payment attempts/user/minute',
          '☐ Fraud detection: Stripe Radar enabled',
          '☐ Legal: Terms of Service updated với payment terms',
          '☐ Support: FAQ cho "thanh toán thất bại" đã viết',
          '☐ Canary: 5% traffic test thành công ≥ 24h'
        ]}
      ],
      timeline: s.id==='bugfix' ? [
        {when:'Ngày 0', what:'Deploy fix lên production (giờ thấp điểm)'},
        {when:'Ngày 0-1', what:'Monitor response time liên tục, so sánh với baseline'},
        {when:'Ngày 2-3', what:'Xác nhận cache hit rate > 85%, không có stale data'},
        {when:'Ngày 7', what:'Đóng ticket, viết summary kết quả (trước/sau)'},
        {when:'Tháng 1', what:'Review: endpoint vẫn < 500ms? Cần điều chỉnh gì không?'}
      ] : s.id==='greenfield' ? [
        {when:'Ngày 0', what:'Thiết lập CI/CD pipeline + staging environment'},
        {when:'Ngày 1-2', what:'Deploy staging, team QA test manual'},
        {when:'Ngày 3', what:'Fix bugs từ QA, deploy lại staging'},
        {when:'Ngày 4', what:'Setup monitoring + alerts + domain'},
        {when:'Ngày 5', what:'Deploy production (soft launch, chưa public)'},
        {when:'Ngày 6-7', what:'Monitor, fix issues, mời beta users'},
        {when:'Tuần 2', what:'Public launch, announce'},
        {when:'Tháng 1', what:'Retrospective: performance, user feedback, next features'}
      ] : [
        {when:'Tuần -1', what:'PCI-DSS SAQ-A submission, Stripe production setup'},
        {when:'Ngày 0', what:'Deploy với feature flag OFF, verify webhook connectivity'},
        {when:'Ngày 1', what:'Bật feature flag 5% users (canary)'},
        {when:'Ngày 2', what:'Monitor: success rate, processing time, no double charges'},
        {when:'Ngày 3', what:'Tăng lên 25% users nếu metrics OK'},
        {when:'Ngày 5', what:'Tăng lên 100% users'},
        {when:'Tuần 2', what:'Review: refund rate, support tickets, Stripe fees'},
        {when:'Tháng 1', what:'PCI quarterly scan, performance review, plan Phase 2 (subscriptions)'}
      ],
      decision: s.id==='bugfix'
        ? 'Tóm tắt: Deploy giờ thấp điểm → Monitor 48h → Confirm fix ổn định → Đóng ticket.'
        : s.id==='greenfield'
        ? 'Tóm tắt: CI/CD → Staging QA → Production soft launch → Monitor 1 tuần → Public launch.'
        : 'Tóm tắt: PCI audit → Feature flag canary (5% → 25% → 100%) → Monitor 24/7 tuần đầu → Quarterly review.'
    }
  };
  return d[id]||null;
}


// ==================== RENDER ====================
function render() {
  const step = steps[idx];
  const body = document.getElementById('contentBody');
  body.innerHTML = step.id === 'select' ? renderSelect() : renderStep(step);
  // Nếu chưa visited → chạy typewriter animation
  if(step.id !== 'select' && !visited[step.id]) {
    visited[step.id] = true;
    typeBlocks();
  }
  updateUI();
}

function renderSelect() {
  return `
    <div class="step-header"><h2>Chọn Bài Toán Để Bắt Đầu</h2><p class="step-desc">Chọn 1 kịch bản. Hệ thống AI-DLC sẽ đưa ra quyết định ở mỗi bước, bạn đóng vai <strong>người phê duyệt</strong>.</p></div>
    <div class="scenario-grid">${Object.values(scenarios).map(s=>`
      <div class="scenario-card ${selected&&selected.id===s.id?'selected':''}" onclick="pick('${s.id}')">
        <h3>${s.name}</h3><p>${s.desc}</p>
        <div class="scenario-meta"><span class="meta-tag">${s.type==='brownfield'?'Brownfield':'Greenfield'}</span><span class="meta-tag">${s.complexity==='minimal'?'Tối thiểu':s.complexity==='standard'?'Tiêu chuẩn':'Toàn diện'}</span></div>
      </div>`).join('')}</div>
    ${selected?`<div class="hint ok"><strong>Đã chọn:</strong> ${selected.name}<br><button class="inline-next" onclick="next()" style="margin-top:10px">Tiếp tục →</button></div>`:`<div class="hint info">Mỗi bài toán kích hoạt các giai đoạn khác nhau.</div>`}`;
}

function renderStep(step) {
  const d = getData(step.id, selected);
  if(!d) return '';
  if(d.skip) return renderSkip(step, d);
  if(d.placeholder) return renderPlaceholder(step, d);

  // Nếu đã visited → hiện ngay (không hidden). Chưa visited → hidden chờ typeBlocks()
  const cls = visited[step.id] ? 'think' : 'think hidden';

  let h = `<div class="step-header"><span class="phase-tag ${step.phase}">Pha ${step.phase==='inception'?'Khởi Đầu':'Xây Dựng'}</span><h2>${step.title}</h2><p class="step-desc">Bài toán: <strong>${selected.short}</strong></p></div>`;
  h += `<div class="${cls} card sys"><h3>🤖 Phân tích</h3><div class="sys-out">${d.analysis}</div></div>`;

  if(d.questions) {
    // Random 3 câu từ pool
    const qs = shuffleAndPick(d.questions, 3);
    h += `<div class="${cls} card"><h3>❓ Câu hỏi xác minh</h3><p style="color:var(--txt2);font-size:.78rem;margin-bottom:12px">Hệ thống cần làm rõ trước khi tiếp tục (chọn 1 option mỗi câu):</p><div class="quiz-list">${qs.map((item,qi)=>`
      <div class="quiz-item">
        <div class="quiz-q">${qi+1}. ${item.q}</div>
        <div class="quiz-opts">${item.opts.map((o,oi)=>`<label class="quiz-opt"><input type="radio" name="q${qi}" value="${oi}"><span>${String.fromCharCode(65+oi)}) ${o}</span></label>`).join('')}<label class="quiz-opt other"><input type="radio" name="q${qi}" value="other"><span>X) Khác:</span><input type="text" class="quiz-input" placeholder="Nhập câu trả lời..."></label></div>
      </div>`).join('')}</div></div>`;
  }
  if(d.stories) h += `<div class="${cls} card"><h3>📖 Câu chuyện người dùng</h3><ul class="story-list">${d.stories.map(st=>`<li>"${st}"</li>`).join('')}</ul></div>`;
  if(d.plan) h += `<div class="${cls} card"><h3>📋 Kế hoạch thực thi</h3><table class="plan-table"><thead><tr><th>Giai đoạn</th><th>Quyết định</th><th>Lý do</th></tr></thead><tbody>${d.plan.map(p=>`<tr><td>${p.stage}</td><td><span class="plan-dec ${p.dec==='THỰC THI'?'exec':'skip'}">${p.dec}</span></td><td>${p.why}</td></tr>`).join('')}</tbody></table></div>`;
  if(d.units) h += `<div class="${cls} card"><h3>📦 Đơn vị công việc</h3>${d.units.map((u,i)=>`<div class="unit-item"><div class="unit-num">${i+1}</div><div class="unit-info"><strong>${u.n}</strong><p>${u.d}</p></div></div>`).join('')}</div>`;
  if(d.artifacts) h += `<div class="${cls} card"><h3>📄 Tài liệu sẽ tạo</h3><div class="artifacts">${d.artifacts.map(a=>`<span class="artifact">${a}</span>`).join('')}</div></div>`;
  if(d.decision) h += `<div class="${cls} card" style="border-left:3px solid var(--mut);background:var(--mut-l)"><h3>💡 Đề xuất</h3><div>${d.decision}</div></div>`;

  h += `<div class="${cls} card gate-card"><h3>⏸ Cổng Phê Duyệt</h3><p style="color:var(--txt2);font-size:.8rem;margin-bottom:12px">Hệ thống dừng lại chờ bạn. Không giai đoạn nào tự tiến tới.</p><div class="approval-actions">${d.options.map(o=>`<button class="approval-btn ${o.t}" onclick="decide('${step.id}','${o.id}')">${o.label}</button>`).join('')}</div></div>`;

  if(decisions[step.id]) h += renderResult(step.id);
  return h;
}

function renderSkip(step, d) {
  const cls = visited[step.id] ? 'think' : 'think hidden';

  let h = `<div class="step-header"><span class="phase-tag ${step.phase}">Pha ${step.phase==='inception'?'Khởi Đầu':'Xây Dựng'}</span><h2>${step.title}</h2><p class="step-desc">Bài toán: <strong>${selected.short}</strong></p></div>`;
  h += `<div class="${cls} skip-notice"><div class="skip-icon">⏭️</div><h3>BỎ QUA</h3><p>${d.skipReason}</p></div>`;
  h += `<div class="${cls} card"><h3>Bạn có đồng ý?</h3><div class="approval-actions"><button class="approval-btn approve" onclick="decide('${step.id}','agree-skip')">✅ Đồng ý bỏ qua</button><button class="approval-btn" onclick="decide('${step.id}','force')">Ghi đè — Thực thi giai đoạn này</button></div></div>`;
  if(decisions[step.id]) h += renderResult(step.id);
  return h;
}

function renderPlaceholder(step, d) {
  const cls = visited[step.id] ? '' : 'think';

  let h = `<div class="step-header"><span class="phase-tag operations">PHA VẬN HÀNH</span><h2>${step.title}</h2><p class="step-desc">Bài toán: <strong>${selected.short}</strong></p></div>`;
  if(!visited[step.id]) h += `<div class="${cls}"><div class="dots">Hệ thống đang tổng kết <span></span><span></span><span></span></div></div>`;
  h += `<div class="${cls} card sys"><h3>🤖 Phân tích</h3><div class="sys-out">${d.analysis}</div></div>`;

  // 5 sections chi tiết
  if(d.opsSections) {
    d.opsSections.forEach(sec => {
      h += `<div class="${cls} card"><h3>${sec.icon} ${sec.title}</h3><ul class="q-list">${sec.items.map(item=>`<li>${item}</li>`).join('')}</ul></div>`;
    });
  }

  // Timeline
  if(d.timeline) {
    h += `<div class="${cls} card"><h3>📅 Lộ trình Sau Khi Code Hoàn Tất</h3><table class="plan-table"><thead><tr><th>Thời điểm</th><th>Hoạt động</th></tr></thead><tbody>${d.timeline.map(t=>`<tr><td><strong>${t.when}</strong></td><td>${t.what}</td></tr>`).join('')}</tbody></table></div>`;
  }

  // Tóm tắt
  if(d.decision) h += `<div class="${cls} card" style="border-left:3px solid var(--mut);background:var(--mut-l)"><h3>📌 Tóm tắt</h3><div style="font-size:.84rem;color:var(--txt)">${d.decision}</div></div>`;

  // Kết thúc
  h += `<div class="${cls} card" style="text-align:center;padding:28px"><div style="font-size:2rem;margin-bottom:8px">🎉</div><h3 style="margin-bottom:6px">Luồng AI-DLC Hoàn Tất</h3><p style="color:var(--txt2);font-size:.84rem">Bạn đã đi qua toàn bộ quy trình AI-DLC cho bài toán <strong>${selected.short}</strong>.<br>Quay lại trang đầu để thử bài toán khác.</p></div>`;
  return h;
}

function renderResult(id) {
  const dec = decisions[id];
  const ok = dec.includes('approve')||dec.includes('agree');
  const io = getIO(steps[idx].id, selected);
  let h = `<div class="decision-result ${ok?'approved':'changed'}"><div class="decision-result-icon">${ok?'✅':'🔧'}</div><div class="decision-result-text"><strong>${ok?'Đã Phê duyệt':'Đã Yêu cầu Thay đổi'}</strong><p>${ok?'Hệ thống ghi nhận vào audit.md và sẵn sàng tiến tới giai đoạn tiếp.':'Hệ thống sẽ điều chỉnh rồi trình bày lại để phê duyệt.'}</p></div></div>`;
  if(io) {
    h += `<div class="io-summary"><div class="io-section"><div class="io-label">📥 Đầu vào — File được đọc</div><div class="io-files">${io.inputs.map(f=>`<div class="io-file input">📄 ${f}</div>`).join('')}</div></div>`;
    h += `<div class="io-section"><div class="io-label">📤 Đầu ra — File được tạo/cập nhật</div><div class="io-files">${io.outputs.map(f=>`<div class="io-file output">✏️ ${f}</div>`).join('')}</div></div>`;
    h += `<div class="io-section"><div class="io-label">📐 Quy tắc — Rule files được nạp</div><div class="io-files">${io.rules.map(f=>`<div class="io-file rule">📋 ${f}</div>`).join('')}</div></div></div>`;
  }
  // Nút tiếp tục inline (chỉ hiện nếu chưa phải step cuối)
  if(idx < steps.length - 1) {
    h += `<button class="inline-next" onclick="next()">Tiếp tục →</button>`;
  }
  return h;
}

// Track which steps have been visited (animation already played)
let visited = {};

// Helper: shuffle array and pick n items
function shuffleAndPick(arr, n) {
  const copy = [...arr];
  for(let i = copy.length-1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [copy[i],copy[j]]=[copy[j],copy[i]]; }
  return copy.slice(0, n);
}

// ==================== ACTIONS ====================
function pick(id) { selected = scenarios[id]; decisions = {}; visited = {}; render(); }
function decide(stepId, dec) {
  decisions[stepId] = dec;
  // Xóa kết quả cũ
  document.querySelectorAll('.decision-result,.io-summary,.inline-next,.ai-loading').forEach(el=>el.remove());

  // Hiển thị loading spinner
  const container = document.getElementById('contentBody');
  const loader = document.createElement('div');
  loader.className = 'ai-loading';
  loader.innerHTML = '<div class="ai-loading-inner"><div class="ai-spinner"></div><span>Đang xử lý...</span></div>';
  container.appendChild(loader);
  loader.scrollIntoView({behavior:'smooth',block:'center'});

  // Sau 1.5s → xóa loader, append kết quả với typewriter
  setTimeout(()=>{
    loader.remove();
    const tmp = document.createElement('div');
    tmp.innerHTML = renderResult(stepId);
    const nodes = [];
    while(tmp.firstChild) { nodes.push(tmp.firstChild); container.appendChild(tmp.firstChild); }
    // Chạy typewriter trên output
    typeOutputNodes(nodes);
    setTimeout(()=>{const r=document.querySelector('.decision-result');if(r)r.scrollIntoView({behavior:'smooth',block:'start'})},50);
  }, 1500);
}

function typeOutputNodes(nodes) {
  const textNodes = [];
  nodes.forEach(n => {
    if(n.nodeType === 1) {
      const walker = document.createTreeWalker(n, NodeFilter.SHOW_TEXT, null);
      let tn;
      while(tn = walker.nextNode()) { if(tn.textContent.trim()) textNodes.push(tn); }
    }
  });
  if(!textNodes.length) return;
  const originals = textNodes.map(n => { const t = n.textContent; n.textContent = ''; return t; });
  let ni = 0, ci = 0;
  function tick() {
    if(ni >= textNodes.length) return;
    ci++;
    textNodes[ni].textContent = originals[ni].slice(0, ci);
    if(ci >= originals[ni].length) { ni++; ci = 0; }
    setTimeout(tick, 8);
  }
  tick();
}

function updateUI() {
  document.querySelectorAll('.phase-btn').forEach((btn,i)=>{
    btn.classList.remove('active','done','skipped');
    if(i===idx) btn.classList.add('active');
    else if(i<idx && selected) {
      const st = steps[i];
      if(st.id!=='select') { const d=getData(st.id,selected); btn.classList.add(d&&d.skip?'skipped':'done'); }
    }
  });
  document.getElementById('prevBtn').disabled = idx===0;
  document.getElementById('nextBtn').disabled = idx===steps.length-1||(!selected&&idx===0);
  document.getElementById('progressFill').style.width = (idx/(steps.length-1)*100)+'%';
}

function next() { if(!selected&&idx===0)return; if(idx<steps.length-1){idx++;render();window.scrollTo({top:0,behavior:'smooth'});closeMobile();} }
function prev() { if(idx>0){idx--;render();window.scrollTo({top:0,behavior:'smooth'});closeMobile();} }
function goTo(i) { if(!selected&&i>0)return; idx=i; render(); window.scrollTo({top:0,behavior:'smooth'}); closeMobile(); }

function toggleMenu() { document.querySelector('.sidebar').classList.toggle('open'); }
function closeMobile() { document.querySelector('.sidebar').classList.remove('open'); }

// ==================== TYPEWRITER ENGINE ====================
function typeBlocks() {
  const blocks = document.querySelectorAll('.think.hidden');
  if(!blocks.length) return;
  let i = 0;
  function showNext() {
    if(i >= blocks.length) return;
    const block = blocks[i];
    block.classList.remove('hidden');
    // Collect all text content to type
    typeInside(block, () => { i++; setTimeout(showNext, 200); });
  }
  showNext();
}

function typeInside(el, onDone) {
  // Find all leaf text nodes that have content
  const textNodes = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  let node;
  while(node = walker.nextNode()) {
    if(node.textContent.trim()) textNodes.push(node);
  }
  if(!textNodes.length) { onDone(); return; }

  // Store original text, clear all
  const originals = textNodes.map(n => { const t = n.textContent; n.textContent = ''; return t; });

  let ni = 0, ci = 0;
  const speed = 12; // ms per character
  function tick() {
    if(ni >= textNodes.length) { onDone(); return; }
    const full = originals[ni];
    ci++;
    textNodes[ni].textContent = full.slice(0, ci);
    if(ci >= full.length) { ni++; ci = 0; }
    setTimeout(tick, speed);
  }
  tick();
}

document.addEventListener('DOMContentLoaded', ()=>{
  render();
  document.getElementById('prevBtn').addEventListener('click', prev);
  document.getElementById('nextBtn').addEventListener('click', next);
  document.querySelectorAll('.phase-btn').forEach((btn,i)=>btn.addEventListener('click',()=>goTo(i)));
  document.addEventListener('keydown', e=>{ if(e.key==='ArrowRight'){e.preventDefault();next();} if(e.key==='ArrowLeft'){e.preventDefault();prev();} });
});
